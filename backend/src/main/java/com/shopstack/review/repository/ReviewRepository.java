package com.shopstack.review.repository;

import com.shopstack.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<Review> findByCustomerId(Long customerId);

    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);

    // Calculate Average Rating for a Product
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    // Count Total Reviews for a Product
    Long countByProductId(Long productId);
}