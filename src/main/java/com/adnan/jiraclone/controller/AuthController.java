package com.adnan.jiraclone.controller;

import com.adnan.jiraclone.dto.AuthRequest;
import com.adnan.jiraclone.dto.AuthResponse;
import com.adnan.jiraclone.dto.RefreshTokenRequest;
import com.adnan.jiraclone.dto.RegisterRequest;
import com.adnan.jiraclone.model.User;
import com.adnan.jiraclone.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid RegisterRequest request) {
        User created = authService.register(request.getUsername(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok(created);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }
}
