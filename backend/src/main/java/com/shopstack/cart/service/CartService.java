package com.shopstack.cart.service;

import com.shopstack.cart.dto.AddToCartRequest;
import com.shopstack.cart.dto.CartItemResponse;
import com.shopstack.cart.dto.CartResponse;
import com.shopstack.cart.entity.Cart;
import com.shopstack.cart.entity.CartItem;
import com.shopstack.cart.repository.CartItemRepository;
import com.shopstack.cart.repository.CartRepository;
import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.CustomerRepository;
import com.shopstack.product.entity.Product;
import com.shopstack.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    // Get cart by Customer ID (creates an empty cart if none exists)
    @Transactional
    public CartResponse getCartByCustomerId(Long customerId) {
        Cart cart = getOrCreateCart(customerId);
        return mapToCartResponse(cart);
    }

    // Add item to cart
    @Transactional
    public CartResponse addItemToCart(Long customerId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(customerId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        if (!product.isActive()) {
            throw new RuntimeException("Product is currently unavailable");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock quantity available");
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .build();

            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        recalculateCartTotal(cart);
        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    // Remove item from cart
    @Transactional
    public CartResponse removeItemFromCart(Long customerId, Long productId) {
        Cart cart = getOrCreateCart(customerId);

        CartItem itemToRemove = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.getItems().remove(itemToRemove);
        cartItemRepository.delete(itemToRemove);

        recalculateCartTotal(cart);
        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    // Helper method to fetch or initialize a cart
    private Cart getOrCreateCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

                    Cart newCart = Cart.builder()
                            .customer(customer)
                            .totalPrice(BigDecimal.ZERO)
                            .build();

                    return cartRepository.save(newCart);
                });
    }

    // Recalculate total price of cart
    private void recalculateCartTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(total);
    }

    // Map Entity to Response DTO
    private CartResponse mapToCartResponse(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .customerId(cart.getCustomer().getId())
                .totalPrice(cart.getTotalPrice())
                .items(cart.getItems().stream().map(item -> CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getPrice())
                        .subTotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build()).collect(Collectors.toList()))
                .build();
    }
}