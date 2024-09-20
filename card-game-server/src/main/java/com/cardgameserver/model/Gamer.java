package com.cardgameserver.model;

public class Gamer {
    public enum Role {
        PLAYER, ADMIN
    }

    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private String password;
    private String token;

    public Gamer(String firstName, String lastName, String email, Role role, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    public Gamer(int id, String firstName, String lastName, String email, Role role, String password, String token) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
        this.token = token;
    }

    public Gamer(int id, String firstName, String lastName, String email, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    public Gamer(int id, String firstName, String lastName, String email, Role role, String token) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public String getPassword() {
        return password;
    }

    public String getToken() {
        return token;
    }
}

