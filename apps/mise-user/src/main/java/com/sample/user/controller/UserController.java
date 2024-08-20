package com.sample.user.controller;

import com.sample.user.service.UserService;
import com.sample.user.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");

        try {
            Map<String, String> data = userService.findUserByEmail(email);
            return ResponseBuilder.buildSuccessResponse("Login successful", data);
        } catch (RuntimeException e) {
            return ResponseBuilder.buildErrorResponse(HttpStatus.NOT_FOUND, "User not Found");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String name = user.get("name");
        String password = user.get("password");

        try {
            userService.registerUser(email, name, password);
            return ResponseBuilder.buildSuccessResponse("User registered successfully", null);
        } catch (RuntimeException e) {
            return ResponseBuilder.buildErrorResponse(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");

        try {
            userService.deleteUserByEmail(email);
            return ResponseBuilder.buildSuccessResponse("User deleted successfully", null);
        } catch (RuntimeException e) {
            return ResponseBuilder.buildErrorResponse(HttpStatus.NOT_FOUND, "User not Found");
        }
    }
}
