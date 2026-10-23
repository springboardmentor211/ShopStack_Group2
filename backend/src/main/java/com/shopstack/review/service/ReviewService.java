package com.shopstack.review.service;

import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.CustomerRepository;
import com.shopstack.product.entity.Product;
import com.shopstack.product.repository.ProductRepository;
import com.shopstack.review.dto.CreateReviewRequest;
import com.shopstack.review.dto.ReviewResponse;
import com.shopstack.review.entity.Review;
import com.shopstack.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Transactional
    public ReviewResponse addReview(CreateReviewRequest request) {
        if (reviewRepository.existsByCustomerIdAndProductId(request.getCustomerId(), request.getProductId())) {
            throw new RuntimeException("Customer has already reviewed this product");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        Review review = Review.builder()
                .customer(customer)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update Average Rating and Total Reviews count in Product Entity
        Double avgRating = reviewRepository.findAverageRatingByProductId(product.getId());
        Long totalReviews = reviewRepository.countByProductId(product.getId());

        product.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        product.setTotalReviews(totalReviews.intValue());
        productRepository.save(product);

        return mapToReviewResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}