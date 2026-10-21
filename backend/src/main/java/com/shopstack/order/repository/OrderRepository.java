package com.shopstack.order.repository;

import com.shopstack.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Fetch order history for a specific customer
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}