package com.shopstack.wishlist.service;

import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.CustomerRepository;
import com.shopstack.product.entity.Product;
import com.shopstack.product.repository.ProductRepository;
import com.shopstack.wishlist.dto.WishlistRequest;
import com.shopstack.wishlist.dto.WishlistResponse;
import com.shopstack.wishlist.entity.Wishlist;
import com.shopstack.wishlist.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    // Add item to Wishlist
    @Transactional
    public WishlistResponse addToWishlist(WishlistRequest request) {
        if (wishlistRepository.existsByCustomerIdAndProductId(request.getCustomerId(), request.getProductId())) {
            throw new RuntimeException("Product is already in wishlist");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        Wishlist wishlist = Wishlist.builder()
                .customer(customer)
                .product(product)
                .build();

        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        return mapToWishlistResponse(savedWishlist);
    }

    // Get all wishlist items for a customer
    public List<WishlistResponse> getCustomerWishlist(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new RuntimeException("Customer not found with id: " + customerId);
        }

        return wishlistRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToWishlistResponse)
                .collect(Collectors.toList());
    }

    // Remove item from Wishlist by product ID
    @Transactional
    public void removeFromWishlist(Long customerId, Long productId) {
        if (!wishlistRepository.existsByCustomerIdAndProductId(customerId, productId)) {
            throw new RuntimeException("Item not found in wishlist");
        }
        wishlistRepository.deleteByCustomerIdAndProductId(customerId, productId);
    }

    private WishlistResponse mapToWishlistResponse(Wishlist wishlist) {
        return WishlistResponse.builder()
                .id(wishlist.getId())
                .customerId(wishlist.getCustomer().getId())
                .productId(wishlist.getProduct().getId())
                .productName(wishlist.getProduct().getName())
                .productPrice(wishlist.getProduct().getPrice())
                .productImage(wishlist.getProduct().getImageUrl())
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}