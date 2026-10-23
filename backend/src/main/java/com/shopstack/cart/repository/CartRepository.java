package com.shopstack.cart.repository;

import com.shopstack.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // Fetch cart associated with a specific customer
    Optional<Cart> findByCustomerId(Long customerId);
}