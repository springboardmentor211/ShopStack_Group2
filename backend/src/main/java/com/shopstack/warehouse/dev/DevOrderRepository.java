package com.shopstack.warehouse.dev;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DevOrderRepository extends JpaRepository<DevOrder, String> {

    List<DevOrder> findByWarehouseIdOrderByPlacedAtDesc(String warehouseId);

    List<DevOrder> findByWarehouseIdAndStatusOrderByPlacedAtDesc(String warehouseId, String status);

    Optional<DevOrder> findByIdAndWarehouseId(String id, String warehouseId);

    long countByWarehouseIdAndStatus(String warehouseId, String status);

    long countByWarehouseIdAndDeliveryDate(String warehouseId, java.time.LocalDate deliveryDate);
}
