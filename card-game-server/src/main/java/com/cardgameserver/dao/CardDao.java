package com.cardgameserver.dao;

import com.cardgameserver.model.AnswerOption;
import com.cardgameserver.model.Card;
import com.cardgameserver.model.Gamer;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class CardDao {
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

    public boolean insertCard(Card card) throws SQLException {
        String sql = "INSERT INTO card (question, answer_option, answer, file, category) VALUES (?, ?, ?, ?, ?)";
        connect();

        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        statement.setString(1, card.getQuestion());
        statement.setString(2, card.getAnswerOption());
        statement.setString(3, card.getAnswer());
        statement.setString(4, card.getFile());
        statement.setString(5, card.getCategory());

        boolean rowInserted = statement.executeUpdate() > 0;
        statement.close();
        disconnect();
        return rowInserted;
    }

    public List<Card> listAllCard() throws SQLException {
        List<Card> listGamer = new ArrayList<>();
        String sql = "SELECT * FROM card";
        connect();
        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        ResultSet resultSet = statement.executeQuery(sql);

        while (resultSet.next()) {
            int id = resultSet.getInt("id");
            String question = resultSet.getString("question");
            String answerOption = resultSet.getString("answer_option");
            String answer = resultSet.getString("answer");
            String category = resultSet.getString("category");
            String file = resultSet.getString("file");


            Card card = new Card(id, question, answerOption, answer, file, category);
            listGamer.add(card);
        }

        resultSet.close();
        statement.close();

        disconnect();

        return listGamer;
    }

    public Card getCard(int id) throws SQLException {
        Card card = null;
        String sql = "SELECT * FROM card WHERE id = ?";

        connect();

        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        statement.setInt(1, id);

        ResultSet resultSet = statement.executeQuery();

        if (resultSet.next()) {
            String question = resultSet.getString("question");
            String answerOption = resultSet.getString("answer_option");
            String answer = resultSet.getString("answer");
            String category = resultSet.getString("category");
            String file = resultSet.getString("file");

            card = new Card(id, question, answerOption, answer, file, category);
        }

        resultSet.close();
        statement.close();

        return card;
    }

    public List<Card> getCardByCategory(String category) throws SQLException {
        List<Card> listCard = new ArrayList<>();
        String sql = "SELECT * FROM card WHERE category = ?";
        connect();
        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        statement.setString(1, category);
        ResultSet resultSet = statement.executeQuery();

        while (resultSet.next()) {
            int id = resultSet.getInt("id");
            String question = resultSet.getString("question");
            String answerOption = resultSet.getString("answer_option");
            String answer = resultSet.getString("answer");
            String categoryResult = resultSet.getString("category");
            String file = resultSet.getString("file");

            Card card = new Card(id, question, answerOption, answer, file, categoryResult);
            listCard.add(card);
        }

        resultSet.close();
        statement.close();

        disconnect();

        return listCard;
    }

    public int updateCard(Card card) throws SQLException {
        String sql = "UPDATE card SET question = ?, answer_option = ?, answer = ?, file = ?, category = ?";
        sql += " WHERE id = ?";
        connect();

        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        statement.setString(1, card.getQuestion());
        statement.setString(2, card.getAnswerOption());
        statement.setString(3, card.getAnswer());
        statement.setString(4, card.getFile());
        statement.setString(5, card.getCategory());
        statement.setInt(6, card.getId());

        int rowUpdated = statement.executeUpdate();
        statement.close();
        disconnect();
        return rowUpdated;
    }

    public int deleteCard(int id) throws SQLException {
        String sql = "DELETE FROM card where id = ?";
        connect();

        PreparedStatement statement = jdbcConnection.prepareStatement(sql);
        statement.setInt(1, id);

        int rowDeleted = statement.executeUpdate();

        statement.close();
        disconnect();

        return rowDeleted;
    }


}
