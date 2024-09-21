package com.cardgameserver.controller;

import com.cardgameserver.dao.GamerDao;
import com.cardgameserver.model.Gamer;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.util.Base64;

import static com.cardgameserver.controller.SignupServlet.generateKey;

@WebServlet(name = "LoginServlet", value = "/login")
public class LoginServlet extends HttpServlet {

    private GamerDao gamerDao = new GamerDao();
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String email = request.getParameter("email");
        String inputPassword = request.getParameter("password");

        try {

            Gamer gamer = gamerDao.getGamerByEmail(email);

            if (gamer == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.println("{");
                out.println("\"status\": \"error\",");
                out.println("\"message\": \"User not found\"");
                out.println("}");
                return;
            }

            SecretKey secretKey = generateKey();


            byte[] encryptedPassword = encrypt(inputPassword, secretKey);


            if (Base64.getEncoder().encodeToString(encryptedPassword).equals(gamer.getPassword())) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.println("{");
                out.println("\"status\": \"success\",");
                out.println("\"message\": \"Login successful\"");
                out.println("}");
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.println("{");
                out.print("\"encryptedPassword\":\"" + encryptedPassword + "\",");
                out.print("\"Password\":\"" + gamer.getPassword() + "\",");
                out.println("\"status\": \"error\",");
                out.println("\"message\": \"Invalid credentials\"");
                out.println("}");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            out.println("{");
            out.println("\"status\": \"error\",");
            out.println("\"message\": \"" + e.getMessage() + "\"");
            out.println("}");
        }
    }

    private SecretKey generateKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(128);
        return keyGenerator.generateKey();
    }

    private byte[] encrypt(String plainText, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
    }

}
