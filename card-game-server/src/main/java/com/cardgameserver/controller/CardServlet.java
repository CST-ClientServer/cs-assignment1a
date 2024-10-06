package com.cardgameserver.controller;

import com.cardgameserver.dao.CardDao;
import com.cardgameserver.model.*;
import com.cardgameserver.util.FileUtil;
import com.cardgameserver.util.JwtHandler;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.JSONPObject;
import io.jsonwebtoken.Claims;
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

@WebServlet(name="CardServlet", value="/cards/*")
@MultipartConfig
public class CardServlet extends HttpServlet {
    private CardDao cardDao;
    ObjectMapper mapper = new ObjectMapper();

    private static final int ID_PATH_LENGTH = "/id".length() + 1;
    private static final int CATEGORY_PATH_LENGTH = "/category".length() + 1;
    private static final int SUBCATEGORY_PATH_LENGTH = "/subCategory".length() + 1;

    public void init() {
        cardDao= new CardDao();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        try {
            insertCard(request, response);
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String action = request.getPathInfo();

//                // API protection after deployment
//        String authorizationHeader = request.getHeader("Authorization");
//        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
//            String jwt = authorizationHeader.substring(7);
//            JwtHandler jwtHandler = new JwtHandler();
//            Claims claims = jwtHandler.validateToken(jwt);
//            if(claims == null) {
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
//                return;
//            }
//        }

        try {
            if (action.contains("/id")) {
                getCard(request, response);
            } else if (action.contains("/category")) {
                getCardByCategory(request, response);
            } else if (action.contains("/subCategory")) {
                getCardBySubCategory(request, response);
            } else if (action.contains("/categories")) {
                getAllCategory(request, response);
            } else {
                listAllCard(request, response);
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    //Update
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getPathInfo();
        try {
            if (action.contains("/id")) {
                updateCard(request, response);
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    //Delete
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getPathInfo();

        try {
            if (action.contains("/id")) {
                deleteCard(request, response);
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    private void getCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        int id = Integer.parseInt(request.getPathInfo().substring(ID_PATH_LENGTH));
        Card card = cardDao.get(id);

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
        String category = request.getPathInfo().substring(CATEGORY_PATH_LENGTH);
        List<Card> listCard = cardDao.getCardByCategory(category);
        String json = mapper.writeValueAsString(listCard);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void getCardBySubCategory(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        String subCategory = request.getPathInfo().substring(SUBCATEGORY_PATH_LENGTH);
        List<Card> listCard = cardDao.getCardBySubCategory(subCategory);
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
        String subCategory = request.getParameter("subCategory");

        ServletContext context = getServletContext();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        FileInfo file = FileUtil.handleUploadFile(request , context);
        String stringFileInfo = mapper.writeValueAsString(file);


        Card card = new Card(question, answerOption, answer, stringFileInfo, category, subCategory);
        cardDao.insert(card);

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

        int id = Integer.parseInt(request.getPathInfo().substring(ID_PATH_LENGTH));
        String question = request.getParameter("question");
        String answerOption = request.getParameter("answerOption");
        String answer = request.getParameter("answer");
        String category = request.getParameter("category");
        String subCategory = request.getParameter("subCategory");

        // Check here if the file is null
        Part fileCheck = request.getPart("file");

        Card card = null;

        if(fileCheck.getSize() != 0) {

            ServletContext context = getServletContext();
            mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            FileInfo file = FileUtil.handleUploadFile(request, context);
            String stringFileInfo = mapper.writeValueAsString(file);

            card = new Card(id, question, answerOption, answer, stringFileInfo, category, subCategory);
            cardDao.update(card);
        } else {
            card = new Card(id, question, answerOption, answer, category, subCategory);
            cardDao.updateCardWithoutFile(card);
        }


        String json = mapper.writeValueAsString(card);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void deleteCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        int id = Integer.parseInt(request.getPathInfo().substring(ID_PATH_LENGTH));
        cardDao.delete(id);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print("{\"message\": \"1\"}");
            out.flush();
        }
    }

    private void getAllCategory(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        List<Category> listCategory = cardDao.getAllCategory();
        String json = mapper.writeValueAsString(listCategory);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }
    }

    private void listAllCard(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        List<Card> listGamer = cardDao.getAll();
        String json = mapper.writeValueAsString(listGamer);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }
}
