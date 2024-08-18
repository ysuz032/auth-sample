package com.sample.user.controller;

import com.sample.user.entity.User;
import com.sample.user.service.UserService;
import com.sample.user.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");

        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, String> data = user.toMap();
            return ResponseBuilder.buildSuccessResponse("Login successful", data);
        } else {
            return ResponseBuilder.buildErrorResponse(HttpStatus.NOT_FOUND, "User not Found");
        }
    }
}
