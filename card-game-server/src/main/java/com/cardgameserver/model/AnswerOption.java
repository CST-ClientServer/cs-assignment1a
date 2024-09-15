package com.cardgameserver.model;

public class AnswerOption {
    private int id;
    private String answer;

    public AnswerOption(int id, String answer) {
        this.id = id;
        this.answer = answer;
    }

    public int getId() {
        return id;
    }

    public String getAnswer() {
        return answer;
    }
}
