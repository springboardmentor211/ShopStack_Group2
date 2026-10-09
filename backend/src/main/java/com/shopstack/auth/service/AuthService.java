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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

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
}