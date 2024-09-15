package com.cardgameserver.controller;

import com.cardgameserver.dao.CardDao;
import com.cardgameserver.model.AnswerOption;
import com.cardgameserver.model.Card;
import com.cardgameserver.model.Gamer;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.JSONPObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

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
                case "/insert":
                    System.out.println("@@ Im Inserting Card");
                    insertCard(request, response);
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

    private void insertCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        request.setCharacterEncoding("UTF-8");

        String question = request.getParameter("question");
        String answerOption = request.getParameter("answerOption");
        String answer = request.getParameter("answer");
        String category = request.getParameter("category");

        Part filePart = request.getPart("image");
        InputStream inputStream = null;
        if(filePart != null) {
            inputStream = filePart.getInputStream();
        }


        Card card = new Card(question, answerOption, answer, inputStream, category);
        cardDao.insertCard(card);

        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        String json = mapper.writeValueAsString(card);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
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
