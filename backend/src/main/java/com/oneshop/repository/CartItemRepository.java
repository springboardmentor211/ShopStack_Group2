package com.oneshop.repository;

import com.oneshop.modal.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Check karne ke liye ki yeh product pehle se cart mein hai ya nahi
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    // Cart clear karte waqt saare items delete karne ke liye
    void deleteByCartId(Long cartId);
}