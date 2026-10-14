package com.shopstack.auth.service;

import com.shopstack.auth.dto.AuthResponse;
import com.shopstack.auth.dto.LoginRequest;
import com.shopstack.auth.dto.RegisterRequest;
import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.CustomerRepository;
import com.shopstack.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shopstack.auth.dto.WarehouseProfileDto;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.security.jwt.JwtAuthenticationToken;
import com.shopstack.warehouse.entity.Warehouse;
import com.shopstack.warehouse.repository.WarehouseRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .pincode(request.getPincode())
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        String token = jwtUtils.generateJwtToken(savedCustomer.getEmail());

        return AuthResponse.builder()
                .customerId(savedCustomer.getId())
                .name(savedCustomer.getName())
                .email(savedCustomer.getEmail())
                .token(token)
                .message("Account created successfully!")
                .build();
    }

     private final WarehouseRepository warehouseRepository;

    // public AuthService(WarehouseRepository warehouseRepository) {
    //     this.warehouseRepository = warehouseRepository;
    // }

    public WarehouseProfileDto currentProfile() {
        Authentication authentication = currentAuthentication();
        String warehouseId = warehouseIdOf(authentication);
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));
        String role = authentication instanceof JwtAuthenticationToken jwt ? jwt.getRole() : null;
        return new WarehouseProfileDto(
                warehouse.getId(),
                warehouse.getName(),
                warehouse.getCity(),
                warehouse.getOwnerName(),
                displayLabel(role)
        );
    }

    public AuthResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateJwtToken(customer.getEmail());

        return AuthResponse.builder()
                .customerId(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .token(token)
                .message("Login successful!")
                .build();
    }
    /**
     * The JWT carries a canonical role code (WAREHOUSE_STAFF) because that is what
     * SecurityConfig authorises against. The frontend shows the friendly label the
     * API contract documents, e.g. "Warehouse manager". Keep both vocabularies in one
     * place so the auth team can change either without touching controllers.
     */
    private String displayLabel(String roleCode) {
        if (roleCode == null || roleCode.isBlank()) {
            return null;
        }
        return switch (roleCode.trim().toUpperCase().replace(' ', '_')) {
            case "WAREHOUSE_STAFF", "WAREHOUSE_MANAGER" -> "Warehouse manager";
            case "WAREHOUSE_ADMIN" -> "Warehouse admin";
            default -> prettify(roleCode);
        };
    }

    private String prettify(String roleCode) {
        String[] words = roleCode.trim().toLowerCase().split("[\\s_-]+");
        StringBuilder out = new StringBuilder();
        for (String word : words) {
            if (word.isEmpty()) {
                continue;
            }
            if (!out.isEmpty()) {
                out.append(' ');
            }
            out.append(Character.toUpperCase(word.charAt(0))).append(word.substring(1));
        }
        return out.isEmpty() ? null : out.toString();
    }

    private Authentication currentAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user.");
        }
        return authentication;
    }

    private String warehouseIdOf(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwt) {
            return jwt.getWarehouseId();
        }
        throw new ResourceNotFoundException("No authenticated user.");
    }
}
