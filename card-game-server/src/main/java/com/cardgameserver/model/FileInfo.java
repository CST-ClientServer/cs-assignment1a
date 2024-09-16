package com.cardgameserver.model;

public class FileInfo {
    private String originalName;
    private String savedName;
    private String savedPath;
    private String extension;
    private long size;

    public FileInfo() {
    }

    public FileInfo(String originalName, String savedName, String savedPath, String extension, long size) {
        this.originalName = originalName;
        this.savedName = savedName;
        this.savedPath = savedPath;
        this.extension = extension;
        this.size = size;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getSavedName() {
        return savedName;
    }

    public void setSavedName(String savedName) {
        this.savedName = savedName;
    }

    public String getSavedPath() {
        return savedPath;
    }

    public void setSavedPath(String savedPath) {
        this.savedPath = savedPath;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }
}
