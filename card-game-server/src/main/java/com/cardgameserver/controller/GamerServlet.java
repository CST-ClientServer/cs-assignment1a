package com.cardgameserver.controller;

import java.io.*;
import java.sql.SQLException;
import java.util.List;

import com.cardgameserver.dao.GamerDao;

import com.cardgameserver.model.Gamer;
import com.cardgameserver.util.JwtHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "GamerServlet", value = "/gamers/*")
public class GamerServlet extends HttpServlet {
    private GamerDao gamerDao;
    ObjectMapper mapper = new ObjectMapper();

    private static final int ID_PATH_LENGTH = "/id".length() + 1;

    public void init() {
        gamerDao = new GamerDao();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String action = request.getPathInfo();

        try {
            switch (action) {
                case "/login":
                    loginGamer(request, response);
                    break;
                default:
                    insertGamer(request, response);
                    break;
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String action = request.getPathInfo();

//        // API protection after deployment
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
                getGamer(request, response);
            } else {
                listAllGamer(request, response);
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    private void getGamer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        int id = Integer.parseInt(request.getPathInfo().substring(ID_PATH_LENGTH));
        Gamer gamer = gamerDao.get(id);
        String json = mapper.writeValueAsString(gamer);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void loginGamer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        Gamer gamer = gamerDao.loginGamer(email, password);
        String json = mapper.writeValueAsString(gamer);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    // TODO 1: Handle exeption when inserting a gamer with boolean value.
    private void insertGamer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        request.setCharacterEncoding("UTF-8");

        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String email = request.getParameter("email");
        String role = request.getParameter("role");
        String password = request.getParameter("password");

        Gamer gamer = new Gamer(firstName, lastName, email, Gamer.Role.valueOf(role), password);
        gamerDao.insert(gamer);

        String json = mapper.writeValueAsString(gamer);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void listAllGamer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        List<Gamer> listGamer = gamerDao.getAll();
        String json = mapper.writeValueAsString(listGamer);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }


}
