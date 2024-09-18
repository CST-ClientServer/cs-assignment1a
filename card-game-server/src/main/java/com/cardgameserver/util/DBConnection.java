package com.cardgameserver.util;

public enum DBConnection {
    INSTANCE;

    private final String JDBC_URL = "jdbc:mysql://comp3940-carddb.cp8qe4m6wny8.us-east-2.rds.amazonaws.com:3306/card_game";
    private final String JDBC_USERNAME = "root";
    private final String JDBC_PASSWORD = "Comp3940";

    public String getJDBC_URL() {
        return JDBC_URL;
    }

    public String getJDBC_USERNAME() {
        return JDBC_USERNAME;
    }

    public String getJDBC_PASSWORD() {
        return JDBC_PASSWORD;
    }
}
