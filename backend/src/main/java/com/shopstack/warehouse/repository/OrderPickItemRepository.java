package com.shopstack.warehouse.repository;

import com.shopstack.warehouse.entity.OrderPickItem;
import com.shopstack.warehouse.entity.OrderPickItemId;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderPickItemRepository extends JpaRepository<OrderPickItem, OrderPickItemId> {

    /**
     * Ordered by item id so the pick list renders in the same sequence on every read. Without
     * the ORDER BY Postgres is free to return rows in physical order, which changes after a
     * re-seed and makes the list jump around under the picker.
     */
    @Query("SELECT p FROM OrderPickItem p WHERE p.warehouseId = :warehouseId AND p.orderId = :orderId ORDER BY p.itemId")
    List<OrderPickItem> findByWarehouseIdAndOrderId(String warehouseId, String orderId);

    Optional<OrderPickItem> findByOrderIdAndItemId(String orderId, String itemId);

    long countByOrderIdAndPickedFalse(String orderId);

    /**
     * Locks every line of the order for update. Completing a pick takes this lock before
     * decrementing stock, so two pickers finishing the same order serialise and the loser
     * fails the all-items-picked check or the status CAS rather than double-decrementing.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM OrderPickItem p WHERE p.orderId = :orderId ORDER BY p.itemId")
    List<OrderPickItem> findByOrderIdWithLock(String orderId);
}
