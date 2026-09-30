package com.shopstack.auth.service;

import com.shopstack.auth.dto.AuthResponse;
import com.shopstack.auth.dto.LoginRequest;
import com.shopstack.auth.dto.RegisterRequest;
import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CustomerRepository customerRepository;

    // User Registration (Create Account)
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // Security note: BCrypt / PasswordEncoder use karna advisable hai
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .pincode(request.getPincode())
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        return AuthResponse.builder()
                .customerId(savedCustomer.getId())
                .name(savedCustomer.getName())
                .email(savedCustomer.getEmail())
                .token("dummy-jwt-token-for-" + savedCustomer.getEmail())
                .message("Account created successfully!")
                .build();
    }

    // User Login (Sign In)
    public AuthResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!customer.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return AuthResponse.builder()
                .customerId(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .token("dummy-jwt-token-for-" + customer.getEmail())
                .message("Login successful!")
                .build();
    }
}