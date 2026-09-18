package com.oneshop.controller;

import com.oneshop.modal.Cart;
import com.oneshop.service.CartService;

import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor 
@RequestMapping("/api/cart")
public class CartController {

    private CartService cartService;

    // Get Logged-in User's Cart
    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getUserCart(@PathVariable Long userId) {
        Cart cart = cartService.getUserCart(userId);
        return ResponseEntity.ok(cart);
    }

    // Add Item to Cart
    @PostMapping("/add")
    public ResponseEntity<Cart> addItemToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        Cart updatedCart = cartService.addItemToCart(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // Remove Item from Cart
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Cart> removeItemFromCart(
            @RequestParam Long userId,
            @PathVariable Long cartItemId) {
        Cart updatedCart = cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.ok(updatedCart);
    }
}