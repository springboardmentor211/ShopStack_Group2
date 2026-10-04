package com.shopstack.warehouse.dev;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface DevOrderRepository extends JpaRepository<DevOrder, String> {

    List<DevOrder> findByWarehouseIdOrderByPlacedAtDesc(String warehouseId);

    List<DevOrder> findByWarehouseIdAndStatusOrderByPlacedAtDesc(String warehouseId, String status);

    Optional<DevOrder> findByIdAndWarehouseId(String id, String warehouseId);

    long countByWarehouseIdAndStatus(String warehouseId, String status);

    long countByWarehouseIdAndDeliveryDate(String warehouseId, LocalDate deliveryDate);

    long countByWarehouseIdAndDeliveryDateAndStatusIn(String warehouseId, LocalDate deliveryDate, Collection<String> statuses);
}