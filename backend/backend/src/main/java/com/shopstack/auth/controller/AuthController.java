package com.shopstack.auth.controller;

import com.shopstack.auth.dto.WarehouseProfileDto;
import com.shopstack.auth.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public WarehouseProfileDto me() {
        return authService.currentProfile();
    }
}
