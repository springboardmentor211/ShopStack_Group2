package com.oneshop.repository;

import com.oneshop.modal.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // User ID ke basis par active Cart fetch karne ke liye
    Optional<Cart> findByUserId(Long userId);
}