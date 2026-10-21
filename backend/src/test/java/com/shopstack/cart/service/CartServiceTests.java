package com.shopstack.cart.service;

import com.shopstack.cart.dto.CartResponse;
import com.shopstack.cart.entity.Cart;
import com.shopstack.cart.entity.CartItem;
import com.shopstack.cart.repository.CartItemRepository;
import com.shopstack.cart.repository.CartRepository;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.CustomerRepository;
import com.shopstack.product.entity.Product;
import com.shopstack.product.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTests {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void updateCartItemQuantityUpdatesItemAndRecalculatesTotal() {
        BigDecimal unitPrice = new BigDecimal("12.50");
        Customer customer = Customer.builder().id(7L).build();
        Product product = Product.builder()
                .id(101L)
                .name("Mug")
                .price(unitPrice)
                .stockQuantity(10)
                .active(true)
                .build();
        Cart cart = Cart.builder()
                .id(20L)
                .customer(customer)
                .totalPrice(unitPrice)
                .items(new ArrayList<>())
                .build();
        CartItem item = CartItem.builder()
                .id(33L)
                .cart(cart)
                .product(product)
                .quantity(1)
                .price(unitPrice)
                .build();
        cart.getItems().add(item);

        when(cartItemRepository.findByIdAndCartCustomerId(33L, 7L)).thenReturn(Optional.of(item));
        when(cartItemRepository.save(item)).thenReturn(item);
        when(cartRepository.save(cart)).thenReturn(cart);

        CartResponse response = cartService.updateCartItemQuantity(7L, 33L, 3);

        assertEquals(3, item.getQuantity());
        assertEquals(new BigDecimal("37.50"), cart.getTotalPrice());
        assertEquals(new BigDecimal("37.50"), response.getTotalPrice());
        assertEquals(new BigDecimal("37.50"), response.getItems().get(0).getSubTotal());
        verify(cartItemRepository).findByIdAndCartCustomerId(33L, 7L);
    }

    @Test
    void updateCartItemQuantityRejectsItemsOwnedByAnotherCustomer() {
        when(cartItemRepository.findByIdAndCartCustomerId(33L, 8L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> cartService.updateCartItemQuantity(8L, 33L, 2));
    }
}
