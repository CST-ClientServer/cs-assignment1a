package com.cardgameserver.util;

import io.github.cdimascio.dotenv.Dotenv;

public enum DBConnection {
    INSTANCE;
    Dotenv dotenv = Dotenv.load();

    private final String JDBC_URL = dotenv.get("JDBC_URL");
    private final String JDBC_USERNAME = dotenv.get("JDBC_USERNAME");
    private final String JDBC_PASSWORD = dotenv.get("JDBC_PASSWORD");

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
