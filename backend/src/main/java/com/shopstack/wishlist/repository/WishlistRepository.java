package com.shopstack.wishlist.repository;

import com.shopstack.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Fetch all wishlist items for a customer ordered by newest first
    List<Wishlist> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    // Find a specific wishlist entry by customer ID and product ID
    Optional<Wishlist> findByCustomerIdAndProductId(Long customerId, Long productId);

    // Check if a product is already present in customer's wishlist
    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);

    // Remove a product from customer's wishlist
    void deleteByCustomerIdAndProductId(Long customerId, Long productId);
}