package com.oneshop.service;

import com.oneshop.dto.OrderRequest;
import com.oneshop.modal.Order;
import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequest request);
    List<Order> getOrdersByUserId(Long userId);
    Order getOrderById(Long orderId);
    Order updateOrderStatus(Long orderId, String status);
}