package com.shopstack.warehouse.dev;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevOrderItemRepository extends JpaRepository<DevOrderItem, DevOrderItemId> {

    List<DevOrderItem> findByOrderIdOrderByItemId(String orderId);

    int countByOrderId(String orderId);

    void deleteByOrderId(String orderId);
}
