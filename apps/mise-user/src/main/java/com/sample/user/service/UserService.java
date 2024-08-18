package com.sample.user.service;

import com.sample.user.entity.User;
import com.sample.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, String> findUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, String> data = user.toMap();
            return data;
        } else {
            throw new RuntimeException("User not Found");
        }
    }

    public void registerUser(String email, String name, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use.");
        }

        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(password);

        try {
            // パスワード登録
            userRepository.save(user);
        } catch (Error e) {
            // コンソール出力
            System.err.println("Error occurred while saving user: " + e.getMessage());
            throw e;
        }
        return;
    }
}
