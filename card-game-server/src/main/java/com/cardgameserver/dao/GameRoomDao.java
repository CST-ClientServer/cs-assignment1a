package com.cardgameserver.dao;

import com.cardgameserver.model.GameRoom;
import com.cardgameserver.util.ConnectionManager;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class GameRoomDao {

    public boolean insertGameRoom(GameRoom gameRoom) throws SQLException {
        String sql = "INSERT INTO game_rooms (pin, sub_category, created_at) VALUES (?, ?, ?)";
        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, gameRoom.getPin());
            statement.setString(2, gameRoom.getSubCategory());
            statement.setTimestamp(3, Timestamp.valueOf(gameRoom.getCreatedAt()));

            return statement.executeUpdate() > 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public GameRoom getGameRoomByPin(String pin) throws SQLException {
        String sql = "SELECT * FROM game_rooms WHERE pin = ?";
        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, pin);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String subCategory = resultSet.getString("sub_category");
                    LocalDateTime createdAt = resultSet.getTimestamp("created_at").toLocalDateTime();

                    return new GameRoom(id, pin, subCategory, createdAt);
                }
            }
        }

        return null;
    }

    public List<GameRoom> listAllGameRooms() throws SQLException {
        List<GameRoom> gameRooms = new ArrayList<>();
        String sql = "SELECT * FROM game_rooms";
        try (Connection connection = ConnectionManager.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String pin = resultSet.getString("pin");
                String subCategory = resultSet.getString("sub_category");
                LocalDateTime createdAt = resultSet.getTimestamp("created_at").toLocalDateTime();
                gameRooms.add(new GameRoom(id, pin, subCategory, createdAt));
            }
        }

        return gameRooms;
    }
}
