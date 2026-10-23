package com.shopstack.auth.controller;

import com.shopstack.auth.dto.AuthResponse;
import com.shopstack.auth.dto.LoginRequest;
import com.shopstack.auth.dto.RegisterRequest;
import com.shopstack.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shopstack.auth.dto.WarehouseProfileDto;
import com.shopstack.auth.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST: Create Account / Sign Up
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST: Sign In / Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }




 // @RestController
 // @RequestMapping("/api/auth")
 // public class AuthController {


    // public AuthController(AuthService authService) {
    //     this.authService = authService;
    // }

    @GetMapping("/me")
    public WarehouseProfileDto me() {
        return authService.currentProfile();
    // }
}
}
