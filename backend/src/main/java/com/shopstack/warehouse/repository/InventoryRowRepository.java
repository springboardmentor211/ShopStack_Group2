package com.shopstack.warehouse.repository;

import com.shopstack.warehouse.entity.InventoryRow;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRowRepository extends JpaRepository<InventoryRow, Long> {

    List<InventoryRow> findByWarehouseId(String warehouseId);

    List<InventoryRow> findByWarehouseIdOrderByIdDesc(String warehouseId);

    Optional<InventoryRow> findByWarehouseIdAndSkuAndBin(String warehouseId, String sku, String bin);

    /**
     * Locks every bin row for a SKU and returns them richest-first. Completing a pick takes
     * this lock before decrementing, so two pickers cannot both read the same on-hand and
     * oversell it. The head of the list is the bin the pick list showed.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InventoryRow i WHERE i.warehouseId = :warehouseId AND i.sku = :sku ORDER BY i.qty DESC")
    List<InventoryRow> findByWarehouseIdAndSkuForUpdate(String warehouseId, String sku);

    @Modifying
    @Transactional
    @Query("DELETE FROM InventoryRow i WHERE i.warehouseId = :warehouseId AND i.sku = :sku AND i.bin <> :bin AND i.qty = 0")
    int deleteEmptyRowsInOtherBins(String warehouseId, String sku, String bin);
}