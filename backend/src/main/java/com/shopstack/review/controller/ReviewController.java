package com.shopstack.review.controller;

import com.shopstack.review.dto.CreateReviewRequest;
import com.shopstack.review.dto.ReviewResponse;
import com.shopstack.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // POST: Submit a review & rating
    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(@Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(request));
    }

    // GET: Get all reviews for a specific product
    @GetMapping("/products/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }
}