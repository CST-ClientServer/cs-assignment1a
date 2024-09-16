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
    public String file;
    private String category;

    public Card(String question, String answerOption, String answer, String file, String category) {
        this.question = question;
        this.answerOption = answerOption;
        this.answer = answer;
        this.file = file;
        this.category = category;
    }

    public Card(int id, String question, String answerOption, String answer, String file, String category) {
        this.id = id;
        this.question = question;
        this.answerOption = answerOption;
        this.answer = answer;
        this.file = file;
        this.category = category;
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

    public String getCategory() {
        return category;
    }

    public String getFile() {
        return file;
    }
}
