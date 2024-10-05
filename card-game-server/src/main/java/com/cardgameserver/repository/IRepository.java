package com.cardgameserver.repository;

import java.sql.SQLException;
import java.util.List;

public interface IRepository<T> {
    void init() throws SQLException;
    boolean insert(T entity) throws SQLException;
    List<T> getAll() throws SQLException;
    T get(int id) throws SQLException;
    int update(T entity) throws SQLException;
    int delete(int id) throws SQLException;
    void close() throws SQLException;
}
