package com.shopstack.warehouse.repository;

import com.shopstack.warehouse.entity.WarehouseBin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseBinRepository extends JpaRepository<WarehouseBin, Long> {

    List<WarehouseBin> findByWarehouseId(String warehouseId);

    Optional<WarehouseBin> findByWarehouseIdAndBinLabel(String warehouseId, String binLabel);
}