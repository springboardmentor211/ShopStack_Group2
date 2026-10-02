package com.shopstack.warehouse;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.warehouse.dev.DevOrder;
import com.shopstack.warehouse.dev.DevOrderItem;
import com.shopstack.warehouse.dev.DevOrderItemRepository;
import com.shopstack.warehouse.dev.DevOrderRepository;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import com.shopstack.warehouse.repository.OrderPackingRepository;
import com.shopstack.warehouse.repository.OrderPickItemRepository;
import com.shopstack.warehouse.repository.StockMovementRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * Fixture builder for the customer-side integration tests.
 *
 * <p>Every row it creates is namespaced with a {@code T-} prefix and wiped in {@link #reset()}
 * before each test. That matters here because these tests share one real Postgres instance
 * with the existing warehouse tests, and those wipe {@code inventory_rows} wholesale — a
 * namespaced fixture neither depends on nor disturbs their seed data.
 */
class FulfillmentTestSupport {

    static final String WAREHOUSE = "WH-NORTH";
    static final String OTHER_WAREHOUSE = "WH-SOUTH";
    static final String ZONE = "T";
    static final String BIN_A = "T-BIN-01";
    static final String BIN_B = "T-BIN-02";
    static final String SKU_A = "T-SKU-ALPHA";
    static final String SKU_B = "T-SKU-BRAVO";
    static final String CUSTOMER = "Test Customer";

    private final DevOrderRepository orders;
    private final DevOrderItemRepository orderItems;
    private final InventoryRowRepository inventory;
    private final OrderPickItemRepository pickItems;
    private final OrderPackingRepository packings;
    private final StockMovementRepository movements;

    FulfillmentTestSupport(DevOrderRepository orders,
                           DevOrderItemRepository orderItems,
                           InventoryRowRepository inventory,
                           OrderPickItemRepository pickItems,
                           OrderPackingRepository packings,
                           StockMovementRepository movements) {
        this.orders = orders;
        this.orderItems = orderItems;
        this.inventory = inventory;
        this.pickItems = pickItems;
        this.packings = packings;
        this.movements = movements;
    }

    /** Removes only this fixture's rows, so other test classes keep their own data. */
    void reset() {
        pickItems.deleteAllInBatch();
        packings.deleteAllInBatch();
        movements.deleteAllInBatch();
        orderItems.deleteAllInBatch();
        orders.deleteAllInBatch();
        // deleteAllInBatch issues a single DELETE and flushes, so the rows are gone before
        // the next test inserts its own — a per-row delete() can be deferred by Hibernate
        // and still collide with the INSERT under the unique (warehouse, sku, bin) key.
        List<InventoryRow> seeded = inventory.findByWarehouseId(WAREHOUSE).stream()
                .filter(row -> row.getSku().startsWith("T-SKU"))
                .toList();
        if (!seeded.isEmpty()) {
            inventory.deleteAllInBatch(seeded);
        }
        List<InventoryRow> otherSeeded = inventory.findByWarehouseId(OTHER_WAREHOUSE).stream()
                .filter(row -> row.getSku().startsWith("T-SKU"))
                .toList();
        if (!otherSeeded.isEmpty()) {
            inventory.deleteAllInBatch(otherSeeded);
        }
    }

    DevOrder order(String orderId, String warehouseId, OrderStatus status, LocalDate deliveryDate) {
        return orders.save(DevOrder.builder()
                .id(orderId)
                .warehouseId(warehouseId)
                .status(status.wireValue())
                .deliveryDate(deliveryDate)
                .placedAt(Instant.now())
                .customerName(CUSTOMER)
                .customerPhone("+91 90000 00000")
                .addressLine("1, Test Street")
                .city("Pune")
                .build());
    }

    void item(String orderId, String itemId, String sku, String productName, int qty) {
        orderItems.save(DevOrderItem.builder()
                .orderId(orderId)
                .itemId(itemId)
                .sku(sku)
                .productName(productName)
                .qty(qty)
                .build());
    }

    void twoItemOrder(String orderId, OrderStatus status) {
        order(orderId, WAREHOUSE, status, LocalDate.now().plusDays(2));
        item(orderId, "T-ITEM-1", SKU_A, "Alpha Widget", 1);
        item(orderId, "T-ITEM-2", SKU_B, "Bravo Widget", 1);
        stock(SKU_A, BIN_A, 10);
        stock(SKU_B, BIN_B, 10);
    }

    void stock(String sku, String bin, int qty) {
        inventory.findByWarehouseIdAndSkuAndBin(WAREHOUSE, sku, bin).ifPresentOrElse(
                row -> {
                    row.setQty(qty);
                    inventory.save(row);
                },
                () -> inventory.save(InventoryRow.builder()
                        .warehouseId(WAREHOUSE)
                        .sku(sku)
                        .zone(ZONE)
                        .bin(bin)
                        .qty(qty)
                        .build()));
    }

    List<InventoryRow> stockRows() {
        return inventory.findByWarehouseId(WAREHOUSE).stream()
                .filter(row -> row.getSku().startsWith("T-SKU"))
                .toList();
    }
}
