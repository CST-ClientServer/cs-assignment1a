package com.cardgameserver.util;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.PBEKeySpec;
import java.security.spec.KeySpec;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;

public class EncryptPassword {

    private final byte[] IV = "Comp3940Comp3940".getBytes();

    private SecretKey getSecretKey() throws Exception {
        String SALT = "Comp3940";
        int ITERATION_COUNT = 65536;
        int KEY_LENGTH = 128;
        KeySpec spec = new PBEKeySpec(SALT.toCharArray(), SALT.getBytes(), ITERATION_COUNT, KEY_LENGTH);
        String SECRET_KEY_ALGORITHM = "PBKDF2WithHmacSHA256";
        SecretKeyFactory factory = SecretKeyFactory.getInstance(SECRET_KEY_ALGORITHM);
        return new SecretKeySpec(factory.generateSecret(spec).getEncoded(), "AES");
    }

    public String encrypt(String password) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        IvParameterSpec ivParams = new IvParameterSpec(IV);
        cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(), ivParams);

        byte[] encryptedBytes = cipher.doFinal(password.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public String decrypt(String encryptedPassword) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        IvParameterSpec ivParams = new IvParameterSpec(IV);
        cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), ivParams);

        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
        return new String(decryptedBytes);
    }
}
