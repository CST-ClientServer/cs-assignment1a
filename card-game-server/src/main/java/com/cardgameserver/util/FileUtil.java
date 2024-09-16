package com.cardgameserver.util;

import com.cardgameserver.model.FileInfo;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.Properties;
import java.util.UUID;

public class FileUtil {

    private static String getSavedFileDirectoryPath(ServletContext context) {
        // Define the path relative to the current servlet context
        String relativePath = "/WEB-INF/uploadFiles";

        // Get the absolute path of the web application
        String absolutePath = context.getRealPath(relativePath);

        // Optionally create the directory if it does not exist
        File directory = new File(absolutePath);
        if (!directory.exists()) {
            if (!directory.mkdirs()) {
                throw new IllegalStateException("Failed to create directory: " + absolutePath);
            }
        }

        return absolutePath;
    }


    public static File getUploadDirectory(ServletContext context) {
        String directoryPath = getSavedFileDirectoryPath(context);


        if (directoryPath == null) {
            throw new IllegalStateException("Directory path cannot be null.");
        }

        File uploadDirectory = new File(directoryPath);
        if (!uploadDirectory.exists()) {
            if (!uploadDirectory.mkdirs()) {
                throw new IllegalStateException("Failed to create upload directory.");
            }
        }

        return uploadDirectory;
    }

    public static FileInfo handleUploadFile(HttpServletRequest request, ServletContext context) throws IOException, ServletException {
        File uploadDir = getUploadDirectory(context);
        Part filePart = request.getPart("file");

        return saveFileAndGetVO(filePart, uploadDir);
    }

    private static FileInfo saveFileAndGetVO(Part part, File uploadDir) throws IOException {
        String originalName = part.getSubmittedFileName();
        if (originalName == null || originalName.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file does not have a valid name.");
        }

        // Extract file extension
        String extension = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalName.length() - 1) {
            extension = originalName.substring(dotIndex + 1);
        }

        String savedName = UUID.randomUUID() + "_" + originalName;
        File file = new File(uploadDir, savedName);

        try (InputStream inputStream = part.getInputStream();
             OutputStream outputStream = Files.newOutputStream(file.toPath())) {
            inputStream.transferTo(outputStream);
        } catch (IOException e) {
            throw new IOException("Error saving file: " + e.getMessage(), e);
        }

        return new FileInfo(originalName, savedName, file.getAbsolutePath(), extension, part.getSize());
    }
}
