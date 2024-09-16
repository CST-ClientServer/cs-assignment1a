package com.cardgameserver.model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

import java.io.InputStream;
import java.sql.Blob;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Card {
    private int id;
    private String question;
    private String answerOption;
    private String answer;
    public InputStream image;
    private String category;
    private String imageBase64;

    public Card(String question, String answerOption, String answer, InputStream image, String category) {
        this.question = question;
        this.answerOption = answerOption;
        this.answer = answer;
        this.image = image;
        this.category = category;
    }

    public Card(int id, String question, String answerOption, String answer, InputStream image, String category) {
        this.id = id;
        this.question = question;
        this.answerOption = answerOption;
        this.answer = answer;
        this.image = image;
        this.category = category;
    }

    public Card(int id, String question, String answerOption, String answer, String imageBase64 ,String category) {
        this.id = id;
        this.question = question;
        this.answerOption = answerOption;
        this.answer = answer;
        this.category = category;
        this.imageBase64 = imageBase64;
    }

    public int getId() {
        return id;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswerOption() {
        return answerOption;
    }

    public String getAnswer() {
        return answer;
    }

    public InputStream getImage() {
        return image;
    }

    public String getCategory() {
        return category;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }
}
