package com.cardgameserver.controller;

import java.io.*;
import java.sql.SQLException;
import java.util.List;

import com.cardgameserver.dao.GamerDao;

import com.cardgameserver.model.Gamer;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "GamerServlet", value = "/gamer/*")
public class GamerServlet extends HttpServlet {
    private GamerDao gamerDao;
    ObjectMapper mapper = new ObjectMapper();

    public void init() {
        gamerDao = new GamerDao();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String action = request.getPathInfo();

        try {
            switch (action) {
                case "/get":
                    getGamer(request, response);
                    break;
                case "/insert":
                    insertGamer(request, response);
                    break;
                default:
                    listAllGamer(request, response);
                    break;
            }

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    private void getGamer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        int id = Integer.parseInt(request.getParameter("id"));
        Gamer gamer = gamerDao.getGamer(id);
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
        gamerDao.insertGamer(gamer);

        String json = mapper.writeValueAsString(gamer);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }

    private void listAllGamer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        List<Gamer> listGamer = gamerDao.listAllGamer();
        String json = mapper.writeValueAsString(listGamer);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            out.print(json);
            out.flush();
        }

    }


}
