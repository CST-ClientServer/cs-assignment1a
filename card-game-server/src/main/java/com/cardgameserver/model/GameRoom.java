package com.cardgameserver.model;

import java.time.LocalDateTime;

public class GameRoom {
    private int id;
    private String pin;
    private String subCategory;
    private LocalDateTime createdAt;

    public GameRoom(String pin, String subCategory, LocalDateTime createdAt) {
        this.pin = pin;
        this.subCategory = subCategory;
        this.createdAt = createdAt;
    }

    public GameRoom(int id, String pin, String subCategory, LocalDateTime createdAt) {
        this.id = id;
        this.pin = pin;
        this.subCategory = subCategory;
        this.createdAt = createdAt;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getPin() {
        return pin;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
