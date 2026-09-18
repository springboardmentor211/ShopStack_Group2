package com.oneshop.service;

import com.oneshop.modal.Cart;

public interface CartService {

    Cart addItemToCart(Long userId, Long productId, Integer quantity);

    Cart getUserCart(Long userId);

    Cart removeItemFromCart(Long userId, Long cartItemId);
}