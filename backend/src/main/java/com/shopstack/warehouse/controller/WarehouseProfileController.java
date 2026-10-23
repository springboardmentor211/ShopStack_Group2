package com.shopstack.warehouse.controller;

import com.shopstack.auth.dto.WarehouseProfileDto;
import com.shopstack.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseProfileController {

    private final AuthService authService;

    @GetMapping("/me")
    public WarehouseProfileDto me() {
        return authService.currentProfile();
    }
}
