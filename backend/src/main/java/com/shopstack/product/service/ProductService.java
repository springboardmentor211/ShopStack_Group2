package com.shopstack.product.service;

import com.shopstack.product.dto.ProductRequest;
import com.shopstack.product.dto.ProductResponse;
import com.shopstack.product.entity.Product;
import com.shopstack.product.repository.ProductRepository;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.review.dto.ReviewResponse;
import com.shopstack.review.entity.Review;
import com.shopstack.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    // Create a new product
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .oldPrice(request.getOldPrice())
                .discount(request.getDiscount())
                .stockQuantity(request.getStockQuantity())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .active(true)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct, List.of());
    }

    // Get product by ID
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(id);
        return mapToResponse(product, reviews);
    }

    // Get all active products
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllActiveProducts() {
        return mapProductsWithReviews(productRepository.findByActiveTrue());
    }

    // Get products by category
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(String category) {
        return mapProductsWithReviews(productRepository.findByCategoryAndActiveTrue(category));
    }

    // Update product details
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOldPrice(request.getOldPrice());
        product.setDiscount(request.getDiscount());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct,
                reviewRepository.findByProductIdOrderByCreatedAtDesc(updatedProduct.getId()));
    }

    // Soft delete product by making active = false
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    // Helper method to convert Entity to Response DTO
    private List<ProductResponse> mapProductsWithReviews(List<Product> products) {
        if (products.isEmpty()) {
            return List.of();
        }

        List<Long> productIds = products.stream().map(Product::getId).toList();
        Map<Long, List<Review>> reviewsByProductId = reviewRepository
                .findByProductIdInOrderByCreatedAtDesc(productIds)
                .stream()
                .collect(Collectors.groupingBy(review -> review.getProduct().getId()));

        return products.stream()
                .map(product -> mapToResponse(
                        product, reviewsByProductId.getOrDefault(product.getId(), List.of())))
                .toList();
    }

    private ProductResponse mapToResponse(Product product, List<Review> reviews) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .oldPrice(product.getOldPrice())
                .discount(product.getDiscount())
                .rating(product.getAverageRating())
                .totalReviews(product.getTotalReviews())
                .reviews(reviews.stream().map(this::mapToReviewResponse).toList())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .build();
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