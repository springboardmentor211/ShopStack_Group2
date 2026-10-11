package com.shopstack.cart.repository;

import com.shopstack.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Fetch a specific product inside a specific cart
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    // Scope item lookup to its owning customer to prevent cross-cart updates
    Optional<CartItem> findByIdAndCartCustomerId(Long id, Long customerId);
}