package com.cardgameserver.dao;

import com.cardgameserver.model.Card;
import com.cardgameserver.util.ConnectionManager;

import java.sql.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class CardDao {

    public boolean insertCard(Card card) throws SQLException {
        String sql = "INSERT INTO card (question, answer_option, answer, file, category) VALUES (?, ?, ?, ?, ?)";
        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, card.getQuestion());
            statement.setString(2, card.getAnswerOption());
            statement.setString(3, card.getAnswer());
            statement.setString(4, card.getFile());
            statement.setString(5, card.getCategory());

            return statement.executeUpdate() > 0;
        }
    }

    public List<Card> listAllCard() throws SQLException {
        List<Card> listCard = new ArrayList<>();
        String sql = "SELECT * FROM card";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String question = resultSet.getString("question");
                String answerOption = resultSet.getString("answer_option");
                String answer = resultSet.getString("answer");
                String category = resultSet.getString("category");
                String file = resultSet.getString("file");

                Card card = new Card(id, question, answerOption, answer, file, category);
                listCard.add(card);
            }
        }

        return listCard;
    }

    public Card getCard(int id) throws SQLException {
        Card card = null;
        String sql = "SELECT * FROM card WHERE id = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    String question = resultSet.getString("question");
                    String answerOption = resultSet.getString("answer_option");
                    String answer = resultSet.getString("answer");
                    String category = resultSet.getString("category");
                    String file = resultSet.getString("file");


                    card = new Card(id, question, answerOption, answer, file, category);
                }
            }
        }

        return card;
    }

    public List<Card> getCardByCategory(String category) throws SQLException {
        List<Card> listCard = new ArrayList<>();
        String sql = "SELECT * FROM card WHERE category = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, category);

            try (ResultSet resultSet = statement.executeQuery()) {
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
            }
        }

        return listCard;
    }

    public int updateCard(Card card) throws SQLException {
        String sql = "UPDATE card SET question = ?, answer_option = ?, answer = ?, file = ?, category = ? WHERE id = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, card.getQuestion());
            statement.setString(2, card.getAnswerOption());
            statement.setString(3, card.getAnswer());
            statement.setString(4, card.getFile());
            statement.setString(5, card.getCategory());
            statement.setInt(6, card.getId());

            return statement.executeUpdate();
        }
    }

    public int deleteCard(int id) throws SQLException {
        String sql = "DELETE FROM card WHERE id = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            return statement.executeUpdate();
        }
    }
}
