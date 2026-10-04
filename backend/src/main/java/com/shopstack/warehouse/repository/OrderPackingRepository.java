package com.shopstack.warehouse.repository;

import com.shopstack.warehouse.entity.OrderPacking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderPackingRepository extends JpaRepository<OrderPacking, String> {

    List<OrderPacking> findByWarehouseId(String warehouseId);

    Optional<OrderPacking> findByOrderIdAndWarehouseId(String orderId, String warehouseId);
}
