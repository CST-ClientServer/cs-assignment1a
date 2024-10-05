package com.cardgameserver.controller;

import com.cardgameserver.dao.GameRoomDao;
import com.cardgameserver.model.GameRoom;
import com.cardgameserver.util.HTMLFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

@ServerEndpoint("/game-room")
@WebServlet(name = "GameRoomServlet", value = "/game-room/*")
public class GameRoomServlet extends HttpServlet {
    private static final String GUEST_PREFIX = "Guest";
    private static final AtomicInteger connectionIds = new AtomicInteger(0);
    private static final Set<GameRoomServlet> connections = new CopyOnWriteArraySet<>();
    private static final GameRoomDao gameRoomDao = new GameRoomDao();

    private final String nickname;
    private Session session;
    private Queue<String> messageBacklog = new ArrayDeque<>();
    private boolean messageInProgress = false;

    public GameRoomServlet() {
        nickname = GUEST_PREFIX + connectionIds.getAndIncrement();
    }

    // WebSocket Methods
    @OnOpen
    public void start(Session session) {
        this.session = session;
        connections.add(this);
        String message = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, "has joined.");
        System.out.println("New connection established: " + nickname);
        broadcast(message);
    }

    @OnClose
    public void end() {
        connections.remove(this);
        String message = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, "has disconnected.");
        System.out.println("Connection closed: " + nickname);
        broadcast(message);
    }

    @OnMessage
    public void incoming(String message) {
        System.out.println("Incoming message: " + message);
        try {
            JSONObject jsonMessage = new JSONObject(message);
            String eventType = jsonMessage.get("event").toString();
            switch (eventType) {
                case "answerClick":
                    handleAnswerClick(jsonMessage.get("data").toString());
                    break;
                default:
                    handleChatMessage(jsonMessage.get("data").toString());
                    break;
            }
        } catch (JSONException | IOException e) {
//            e.printStackTrace();
        }
    }

    private void handleAnswerClick(String answer) throws IOException {
        String answerMessage = String.format("{\"event\":\"answerClick\", \"data\": \"%s %s\"}", nickname, answer);
        String answeredMessage = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, "has answered.");
        System.out.println("Handling answer click from " + nickname + ": " + answer);
        broadcast(answerMessage);
        broadcast(answeredMessage);
    }

    private void handleChatMessage(String message) {
        String filteredMessage = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, HTMLFilter.filter(message));
        System.out.println("Handling chat message from " + nickname + ": " + message);
        broadcast(filteredMessage);
    }

    @OnError
    public void onError(Throwable t) {
        System.out.println("Chat Error: " + t.toString());
    }

    private void sendMessage(String msg) throws IOException {
        synchronized (this) {
            if (messageInProgress) {
                messageBacklog.add(msg);
                System.out.println("Message added to backlog for " + nickname + ": " + msg);
                return;
            } else {
                messageInProgress = true;
            }
        }

        boolean queueHasMessagesToBeSent = true;

        String messageToSend = msg;
        do {
            try {
                session.getBasicRemote().sendText(messageToSend);
                System.out.println("Message sent to " + nickname + ": " + messageToSend);
            } catch (IOException e) {
                System.out.println("Failed to send message to " + nickname + ": " + e.getMessage());
                throw e;
            }

            synchronized (this) {
                messageToSend = messageBacklog.poll();
                if (messageToSend == null) {
                    messageInProgress = false;
                    queueHasMessagesToBeSent = false;
                }
            }
        } while (queueHasMessagesToBeSent);
    }

    private static void broadcast(String msg) {
        System.out.println("Broadcasting message: " + msg);
        for (GameRoomServlet client : connections) {
            try {
                client.sendMessage(msg);
            } catch (IOException e) {
                System.out.println("Chat Error: Failed to send message to client: " + e);
                if (connections.remove(client)) {
                    try {
                        client.session.close();
                    } catch (IOException e1) {
                        // Ignore
                    }
                    String message = String.format("* %s %s", client.nickname, "has been disconnected.");
                    broadcast(message);
                }
            }
        }
    }

    public static String generateGamePin(String subCategory) {
        String pin = String.format("%04d", new Random().nextInt(10000));
        LocalDateTime createdAt = LocalDateTime.now();

        GameRoom gameRoom = new GameRoom(pin, subCategory, createdAt);
        try {
            gameRoomDao.insertGameRoom(gameRoom);
            System.out.println("Generated new PIN: " + pin + " for sub-category: " + subCategory);
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Failed to store new game room in the database");
        }

        return pin;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        String action = request.getPathInfo();
        if ("/generate".equals(action)) {
            generateGameRoom(request, response);
        } else {
            doGet(request, response);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        String action = request.getPathInfo();
        if (action == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Action is required");
            return;
        }

        try {
            switch (action) {
                case "/getByPin":
                    getGameRoomByPin(request, response);
                    break;
                case "/list":
                    listAllGameRooms(request, response);
                    break;
                default:
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
                    break;
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }


    private void generateGameRoom(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String subCategory = request.getParameter("subCategory");

        if (subCategory == null || subCategory.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Subcategory is required");
            return;
        }

        String pin = generateGamePin(subCategory);
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode result = mapper.createObjectNode();
        result.put("pin", pin);
        result.put("subCategory", subCategory);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(result.toString());
            out.flush();
        }
    }

    private void getGameRoomByPin(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
        String pin = request.getParameter("pin");

        if (pin == null || pin.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "PIN is required");
            return;
        }

        GameRoom gameRoom = gameRoomDao.getGameRoomByPin(pin);
        if (gameRoom == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Game room not found");
            return;
        }

        ObjectMapper mapper = new ObjectMapper();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(mapper.writeValueAsString(gameRoom));
            out.flush();
        }
    }

    private void listAllGameRooms(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
        List<GameRoom> gameRooms = gameRoomDao.listAllGameRooms();

        ObjectMapper mapper = new ObjectMapper();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(mapper.writeValueAsString(gameRooms));
            out.flush();
        }
    }
}
