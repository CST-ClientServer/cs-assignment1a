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

@WebServlet(name = "SignupServlet", value = "/signup")
public class SignupServlet extends HttpServlet {

    private GamerDao gamerDao = new GamerDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String firstName = "";
        String lastName = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.println("{'get to bnack end': 'true'}");

//        IvParameterSpec iv = generateIv();
        SecretKey secretKey;
        try {
            secretKey = generateKey();
            byte[] encryptedPassword = encrypt(password, secretKey);

            String encryptedPasswordBase64 = Base64.getEncoder().encodeToString(encryptedPassword);

            Gamer gamer = new Gamer(firstName, lastName, email, Gamer.Role.PLAYER, encryptedPasswordBase64);

            boolean isInserted = gamerDao.insertGamer(gamer);

            if (isInserted) {
//                response.setContentType("application/json");
//                response.setCharacterEncoding("UTF-8");
//                PrintWriter out = response.getWriter();
                out.println("{");
                out.println("\"status\": \"success\",");
                out.println("\"message\": \"User created successfully\",");

                out.println("\"username\": \"" + lastName + "\",");
                out.println("\"password\": \"" + password + "\"");
                out.println("}");
            } else {
//                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//                response.setContentType("application/json");
//                response.setCharacterEncoding("UTF-8");
//                PrintWriter out = response.getWriter();
                out.println("{");
                out.println("\"status\": \"error\",");

                out.println("\"message\": \"Failed to create user\"");
                out.println("}");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
//            PrintWriter out = response.getWriter();
            out.println("{");
            out.println("\"status\": \"error\",");

            out.println("\"message\": \"" + e.getMessage() + "\"");
            out.println("}");
        }
    }

    private static IvParameterSpec generateIv() {
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    static SecretKey generateKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(256);
        return keyGenerator.generateKey();
    }

    private static byte[] encrypt(String plainText, SecretKey key)
            throws NoSuchPaddingException, NoSuchAlgorithmException,
            InvalidAlgorithmParameterException, BadPaddingException, IllegalBlockSizeException, InvalidKeyException {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
    }


}