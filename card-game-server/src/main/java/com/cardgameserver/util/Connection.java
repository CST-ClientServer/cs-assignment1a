package com.cardgameserver.util;

import java.sql.DriverManager;
import java.sql.SQLException;

// TODO : One Connection class should be used for all the DAO classes
public class Connection {
    static final String DRIVER = "com.mysql.cj.jdbc.Driver";
    static final String jdbcURL = "jdbc:mysql://localhost:3306/card_game";
    static final String jdbcUsername = "root";
    static final String jdbcPassword = "mysql";
    static final java.sql.Connection jdbcConnection = null;

    static {
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }


}

