package com.cardgameserver.controller;

import com.cardgameserver.util.HTMLFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

@ServerEndpoint("/game-room")
public class GameRoomServlet {

    private static final String GUEST_PREFIX = "Guest";
    private static final AtomicInteger connectionIds = new AtomicInteger(0);
    private static final Set<GameRoomServlet> connections = new CopyOnWriteArraySet<>();

    private final String nickname;
    private Session session;
    private Queue<String> messageBacklog = new ArrayDeque<>();
    private boolean messageInProgress = false;

    public GameRoomServlet() {
        nickname = GUEST_PREFIX + connectionIds.getAndIncrement();
    }

    @OnOpen
    public void start(Session session) {
        this.session = session;
        connections.add(this);
        String message = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, "has joined.");
        broadcast(message);
    }

    @OnClose
    public void end() {
        connections.remove(this);
        String message = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, "has disconnected.");
        broadcast(message);
    }

    @OnMessage
    public void incoming(String message) {
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
            e.printStackTrace();
        }
    }

    private void handleAnswerClick(String answer) throws IOException {
        String answerMessage = String.format("{\"event\":\"answerClick\", \"data\": \"%s %s\"}", nickname, answer);
        String answeredMessage = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, "has answered.");
        broadcast(answerMessage);
        broadcast(answeredMessage);
    }

    private void handleChatMessage(String message) {
        String filteredMessage = String.format("{\"event\":\"messageSend\", \"data\": \"%s %s\"}", nickname, HTMLFilter.filter(message));
        broadcast(filteredMessage);
    }

    @OnError
    public void onError(Throwable t) {
        System.out.println("Chat Error: " + t.toString());
    }

    private void sendToSpecificUser(Session session, String msg) throws IOException {
        session.getBasicRemote().sendText(msg);
    }

    private void sendMessage(String msg) throws IOException {
        synchronized (this) {
            if (messageInProgress) {
                messageBacklog.add(msg);
                return;
            } else {
                messageInProgress = true;
            }
        }

        boolean queueHasMessagesToBeSent = true;

        String messageToSend = msg;
        do {
            session.getBasicRemote().sendText(messageToSend);
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
        for (GameRoomServlet client : connections) {
            try {
                client.sendMessage(msg);
            } catch (IOException e) {
                System.out.println("Chat Error: Failed to send message to client" + e);
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
}
