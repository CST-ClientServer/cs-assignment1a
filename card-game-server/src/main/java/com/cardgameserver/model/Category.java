package com.cardgameserver.model;

public class Category {
    private int id;
    private String category;

    public Category(String category) {
        setFixedId(category);
        this.category = category;
    }

    public int getId() {
        return id;
    }

    public String getCategory() {
        return category;
    }

    public void setFixedId(String category) {
        switch (category) {
            case "Movies":
                this.id = 1;
                break;
            case "Politics":
                this.id = 2;
                break;
            case "Products":
                this.id = 3;
                break;
            case "Music":
                this.id = 4;
                break;
            case "History":
                this.id = 5;
                break;
            case "Science":
                this.id = 6;
                break;
            default:
                this.id = 0;
                break;
        }
    }
}
