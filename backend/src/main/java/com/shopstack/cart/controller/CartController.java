package com.shopstack.cart.controller;

import com.shopstack.cart.dto.AddToCartRequest;
import com.shopstack.cart.dto.CartResponse;
import com.shopstack.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers/{customerId}/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET: Fetch current customer's cart
    @GetMapping
    public ResponseEntity<CartResponse> getCart(@PathVariable Long customerId) {
        return ResponseEntity.ok(cartService.getCartByCustomerId(customerId));
    }

    // POST: Add item to cart
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(
            @PathVariable Long customerId,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(customerId, request));
    }

    // DELETE: Remove item from cart by product ID
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeItemFromCart(
            @PathVariable Long customerId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(customerId, productId));
    }
}