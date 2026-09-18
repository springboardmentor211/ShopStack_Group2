package com.oneshop.service.impl;

import com.oneshop.service.CartService;
import com.oneshop.modal.Cart;
import com.oneshop.modal.CartItem;
import com.oneshop.modal.Product;
import com.oneshop.modal.User;
import com.oneshop.repository.CartItemRepository;
import com.oneshop.repository.CartRepository;
import com.oneshop.repository.ProductRepository;
import com.oneshop.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Cart getUserCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart addItemToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getUserCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.calculateTotalPrice();
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(product.getPrice())
                    .build();

            newItem.calculateTotalPrice();

            if (cart.getItems() == null) {
                cart.setItems(new ArrayList<>());
            }
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cart.updateTotals();
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = getUserCart(userId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + cartItemId));

        if (cartItem.getCart().getId().equals(cart.getId())) {
            cart.getItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
            cart.updateTotals();
            return cartRepository.save(cart);
        } else {
            throw new RuntimeException("Item does not belong to this user's cart.");
        }
    }
}