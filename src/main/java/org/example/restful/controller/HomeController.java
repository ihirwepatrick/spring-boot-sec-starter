package org.example.restful.controller;

import org.example.restful.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<ApiResponse<Map<String, Object>>> home() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Secure Notes API");
        info.put("version", "1.0.0");
        info.put("description", "A RESTful API for managing secure notes");

        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("POST /auth/register", "Register a new user");
        endpoints.put("POST /auth/login", "Login and get JWT token");
        endpoints.put("GET /notes", "List authenticated user's notes (auth required)");
        endpoints.put("POST /notes", "Create a new note (auth required)");
        endpoints.put("GET /notes/{id}", "Get a specific note (auth required)");
        endpoints.put("PUT /notes/{id}", "Update a specific note (auth required)");
        endpoints.put("DELETE /notes/{id}", "Delete a specific note (auth required)");

        info.put("endpoints", endpoints);

        return ResponseEntity.ok(ApiResponse.success("Welcome to Secure Notes API", info));
    }
}
