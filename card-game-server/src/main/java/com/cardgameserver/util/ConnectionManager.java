package com.cardgameserver.util;

import java.sql.*;

public class ConnectionManager {
    private static final String JDBC_URL = DBConnection.INSTANCE.getJDBC_URL();
    private static final String JDBC_USERNAME = DBConnection.INSTANCE.getJDBC_USERNAME();
    private static final String JDBC_PASSWORD = DBConnection.INSTANCE.getJDBC_PASSWORD();

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Cannot load MySQL driver", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(JDBC_URL, JDBC_USERNAME, JDBC_PASSWORD);
    }

    public static void closeConnection(Connection connection) throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}

