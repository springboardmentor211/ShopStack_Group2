package com.shopstack.customer.repository;

import com.shopstack.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Email se customer find karne ke liye (Login aur Auth me kaam aayega)
    Optional<Customer> findByEmail(String email);

    // Check karne ke liye ki email pehle se exist toh nahi karta
    boolean existsByEmail(String email);
}