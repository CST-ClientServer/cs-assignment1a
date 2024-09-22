package com.cardgameserver.dao;

import com.cardgameserver.model.Gamer;
import com.cardgameserver.util.ConnectionManager;
import com.cardgameserver.util.EncryptPassword;
import com.cardgameserver.util.JwtHandler;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GamerDao {

    public boolean insertGamer(Gamer gamer) throws SQLException {
        String sql = "INSERT INTO gamer (firstName, lastName, email, role, password) VALUES (?, ?, ?, ?, ?)";
        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, gamer.getFirstName());
            statement.setString(2, gamer.getLastName());
            statement.setString(3, gamer.getEmail());
            statement.setString(4, gamer.getRole().name());

            // Before inserting the password, we need to hash it.
            EncryptPassword encryptPassword = new EncryptPassword();
            String encryptedPW = encryptPassword.encrypt(gamer.getPassword());

            statement.setString(5,encryptedPW);

            return statement.executeUpdate() > 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<Gamer> listAllGamer() throws SQLException {
        List<Gamer> listGamer = new ArrayList<>();
        String sql = "SELECT * FROM gamer";
        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String firstName = resultSet.getString("firstName");
                String lastName = resultSet.getString("lastName");
                String email = resultSet.getString("email");
                String password = resultSet.getString("password");
                Gamer.Role role = Gamer.Role.valueOf(resultSet.getString("role"));
                Gamer gamer = new Gamer(id, firstName, lastName, email, role, password, null);
                listGamer.add(gamer);
            }
        }

        return listGamer;
    }

    public Gamer getGamer(int id) throws SQLException {
        Gamer gamer = null;
        String sql = "SELECT * FROM gamer WHERE id = ?";


        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    String firstName = resultSet.getString("firstName");
                    String lastName = resultSet.getString("lastName");
                    String email = resultSet.getString("email");
                    Gamer.Role role = Gamer.Role.valueOf(resultSet.getString("role"));

                    gamer = new Gamer(id, firstName, lastName, email, role);
                }
            }
        }


        return gamer;
    }

    public Gamer loginGamer(String email, String password) throws SQLException {
        Gamer gamer = null;
        String sql = "SELECT * FROM gamer WHERE email = ? AND password = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, email);

            EncryptPassword encryptPassword = new EncryptPassword();
            String decryptedPW = encryptPassword.encrypt(password);

            statement.setString(2, decryptedPW);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String firstName = resultSet.getString("firstName");
                    String lastName = resultSet.getString("lastName");
                    Gamer.Role role = Gamer.Role.valueOf(resultSet.getString("role"));

                    JwtHandler jwtHandler = new JwtHandler();
                    String token = jwtHandler.generateToken(id + "" , role.name());

                    gamer = new Gamer(id, firstName, lastName, email, role, token);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return gamer;
    }



}

