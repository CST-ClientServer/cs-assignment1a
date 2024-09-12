package com.cardgame.dao;


import com.cardgame.model.Gamer;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GamerDao {
    private String jdbcURL = "jdbc:mysql://localhost:3306/card_game";
    private String jdbcUsername = "root";
    private String jdbcPassword = "mysql";
    private Connection jdbcConnection;

    protected void connect() throws SQLException {
        if (jdbcConnection == null || jdbcConnection.isClosed()) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException e) {
                throw new SQLException(e);
            }
            jdbcConnection = DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
        }
    }

    protected void disconnect() throws SQLException {
        if (jdbcConnection != null && !jdbcConnection.isClosed()) {
            jdbcConnection.close();
        }
    }

    public boolean insertGamer(Gamer gamer) throws SQLException {
        String sql = "INSERT INTO gamer (firstName, lastName, email, role, password) VALUES (?, ?, ?, ?, ?)";
        connect();

        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        statement.setString(1, gamer.getFirstName());
        statement.setString(2, gamer.getLastName());
        statement.setString(3, gamer.getEmail());
        statement.setString(4, gamer.getRole().name());
        statement.setString(5, gamer.getPassword());

        boolean rowInserted = statement.executeUpdate() > 0;
        statement.close();
        disconnect();
        return rowInserted;
    }

    public List<Gamer> listAllGamer() throws SQLException {
        List<Gamer> listGamer = new ArrayList<>();
        String sql = "SELECT * FROM gamer";
        connect();
        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        ResultSet resultSet = statement.executeQuery(sql);

        while (resultSet.next()) {
            int id = resultSet.getInt("id");
            String firstName = resultSet.getString("firstName");
            String lastName = resultSet.getString("lastName");
            String email = resultSet.getString("email");
            Gamer.Role role = Gamer.Role.valueOf(resultSet.getString("role"));

            Gamer gamer = new Gamer(id, firstName, lastName, email, role);
            listGamer.add(gamer);
        }

        resultSet.close();
        statement.close();

        disconnect();

        return listGamer;
    }

    public Gamer getGamer(int id) throws SQLException {
        Gamer gamer = null;
        String sql = "SELECT * FROM gamer WHERE id = ?";

        connect();

        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        statement.setInt(1, id);

        ResultSet resultSet = statement.executeQuery();

        if (resultSet.next()) {
            String firstName = resultSet.getString("firstName");
            String lastName = resultSet.getString("lastName");
            String email = resultSet.getString("email");
            Gamer.Role role = Gamer.Role.valueOf(resultSet.getString("role"));

            gamer = new Gamer(id, firstName, lastName, email, role);
        }

        resultSet.close();
        statement.close();

        return gamer;
    }



}
