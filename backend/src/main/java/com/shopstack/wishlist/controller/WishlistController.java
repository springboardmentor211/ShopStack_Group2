package com.shopstack.wishlist.controller;

import com.shopstack.wishlist.dto.WishlistRequest;
import com.shopstack.wishlist.dto.WishlistResponse;
import com.shopstack.wishlist.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers/{customerId}/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    // POST: Add product to wishlist
    @PostMapping({"", "/items"})
    public ResponseEntity<WishlistResponse> addToWishlist(
            @PathVariable Long customerId,
            @Valid @RequestBody WishlistRequest request) {
        request.setCustomerId(customerId);
        return ResponseEntity.ok(wishlistService.addToWishlist(request));
    }

    // GET: Get all wishlist items of a customer
    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getCustomerWishlist(@PathVariable Long customerId) {
        return ResponseEntity.ok(wishlistService.getCustomerWishlist(customerId));
    }

    // DELETE: Remove product from wishlist
    @DeleteMapping({"/products/{productId}", "/items/{productId}"})
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long customerId,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(customerId, productId);
        return ResponseEntity.noContent().build();
    }
}