package com.cardgameserver.dao;

import com.cardgameserver.model.Card;
import com.cardgameserver.model.Category;
import com.cardgameserver.util.ConnectionManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.sql.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class CardDao {
    private Category realCategory;
    ObjectMapper mapper = new ObjectMapper();

    public boolean insertCard(Card card) throws SQLException {
        String sql = "INSERT INTO card (question, answer_option, answer, file, category, subCategory) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, card.getQuestion());
            statement.setString(2, card.getAnswerOption());
            statement.setString(3, card.getAnswer());
            statement.setString(4, card.getFile());
            statement.setString(5, card.getCategory());
            statement.setString(6, card.getSubCategory());

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
                String subCategory = resultSet.getString("subCategory");

                String category = resultSet.getString("category");
                realCategory = new Category(category);
                category = mapper.writeValueAsString(realCategory);


                String file = resultSet.getString("file");

                Card card = new Card(id, question, answerOption, answer, file, category, subCategory);
                listCard.add(card);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
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
                    String subCategory = resultSet.getString("subCategory");

                    card = new Card(id, question, answerOption, answer, file, category, subCategory);
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
                    String subCategoryResult = resultSet.getString("subCategory");

                    Card card = new Card(id, question, answerOption, answer, file, categoryResult, subCategoryResult);
                    listCard.add(card);
                }
            }
        }

        return listCard;
    }

    public List<Card> getCardBySubCategory(String subCategory) throws SQLException {
        List<Card> listCard = new ArrayList<>();
        String sql = "SELECT * FROM card WHERE subCategory = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, subCategory);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String question = resultSet.getString("question");
                    String answerOption = resultSet.getString("answer_option");
                    String answer = resultSet.getString("answer");
                    String categoryResult = resultSet.getString("category");
                    String file = resultSet.getString("file");
                    String subCategoryResult = resultSet.getString("subCategory");

                    Card card = new Card(id, question, answerOption, answer, file, categoryResult, subCategoryResult);
                    listCard.add(card);
                }
            }
        }

        return listCard;
    }

    public int updateCard(Card card) throws SQLException {
        String sql = "UPDATE card SET question = ?, answer_option = ?, answer = ?, file = ?, category = ?, subCategory = ? WHERE id = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, card.getQuestion());
            statement.setString(2, card.getAnswerOption());
            statement.setString(3, card.getAnswer());
            statement.setString(4, card.getFile());
            statement.setString(5, card.getCategory());
            statement.setString(6, card.getSubCategory());
            statement.setInt(7, card.getId());

            return statement.executeUpdate();
        }
    }

    public int updateCardWithoutFile(Card card) throws SQLException {
        String sql = "UPDATE card SET question = ?, answer_option = ?, answer = ?, category = ?, subCategory = ? WHERE id = ?";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, card.getQuestion());
            statement.setString(2, card.getAnswerOption());
            statement.setString(3, card.getAnswer());
            statement.setString(4, card.getCategory());
            statement.setString(5, card.getSubCategory());
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

    public List<Category> getAllCategory() throws SQLException {
        List<Category> listCategory = new ArrayList<>();
        String sql = "SELECT DISTINCT category FROM card";

        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                String name = resultSet.getString("category");

                Category category = new Category(name);
                listCategory.add(category);
            }
        }

        return listCategory;
    }
}
