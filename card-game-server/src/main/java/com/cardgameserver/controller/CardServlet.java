package com.cardgameserver.controller;

import com.cardgameserver.dao.CardDao;
import com.cardgameserver.model.AnswerOption;
import com.cardgameserver.model.Card;
import com.cardgameserver.model.FileInfo;
import com.cardgameserver.model.Gamer;
import com.cardgameserver.util.FileUtil;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.JSONPObject;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@WebServlet(name="CardServlet", value="/card/*")
@MultipartConfig
public class CardServlet extends HttpServlet {
    private CardDao cardDao;
    ObjectMapper mapper = new ObjectMapper();


    public void init() {
        cardDao= new CardDao();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String action = request.getPathInfo();

        try {
            switch (action) {
                case "/get":
                    getCard(request, response);
                    break;
                case "/getByCategory":
                    getCardByCategory(request, response);
                    break;
                case "/insert":
                    insertCard(request, response);
                    break;
                case "/update":
                    updateCard(request, response);
                    break;
                case "/delete":
                    deleteCard(request, response);
                    break;
                default:
                    listAllCard(request, response);
                    break;
            }

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    private void getCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        int id = Integer.parseInt(request.getParameter("id"));
        Card card = cardDao.getCard(id);

        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        String json = mapper.writeValueAsString(card);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print(json);

            out.flush();
        }

    }

    private void getCardByCategory(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        String category = request.getParameter("category");
        List<Card> listCard = cardDao.getCardByCategory(category);
        String json = mapper.writeValueAsString(listCard);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void insertCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        request.setCharacterEncoding("UTF-8");

        String question = request.getParameter("question");
        String answerOption = request.getParameter("answerOption");
        String answer = request.getParameter("answer");
        String category = request.getParameter("category");

        ServletContext context = getServletContext();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        FileInfo file = FileUtil.handleUploadFile(request , context);
        String stringFileInfo = mapper.writeValueAsString(file);


        Card card = new Card(question, answerOption, answer, stringFileInfo, category);
        cardDao.insertCard(card);

        String json = mapper.writeValueAsString(card);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void updateCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        request.setCharacterEncoding("UTF-8");

        int id = Integer.parseInt(request.getParameter("id"));
        String question = request.getParameter("question");
        String answerOption = request.getParameter("answerOption");
        String answer = request.getParameter("answer");
        String category = request.getParameter("category");

        ServletContext context = getServletContext();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        FileInfo file = FileUtil.handleUploadFile(request, context);
        String stringFileInfo = mapper.writeValueAsString(file);

        Card card = new Card(id, question, answerOption, answer, stringFileInfo, category);
        cardDao.updateCard(card);


        String json = mapper.writeValueAsString(card);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void deleteCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        int id = Integer.parseInt(request.getParameter("id"));
        cardDao.deleteCard(id);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print("{\"message\": \"1\"}");
            out.flush();
        }
    }

    private void listAllCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        List<Card> listGamer = cardDao.listAllCard();
        String json = mapper.writeValueAsString(listGamer);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }
}
