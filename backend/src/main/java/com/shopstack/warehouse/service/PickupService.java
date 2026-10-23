package com.shopstack.warehouse.service;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.common.enums.PickStage;
import com.shopstack.common.exception.ConflictException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.common.exception.UnprocessableException;
import com.shopstack.common.util.IdGenerator;
import com.shopstack.warehouse.dto.response.ActionResultDto;
import com.shopstack.warehouse.dto.response.PickListDto;
import com.shopstack.warehouse.dto.response.PickupListItemDto;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.entity.OrderPickItem;
import com.shopstack.warehouse.entity.StockMovement;
import com.shopstack.warehouse.port.OrderFulfillmentPort;
import com.shopstack.warehouse.port.dto.OrderItemRecord;
import com.shopstack.warehouse.port.dto.OrderRecord;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import com.shopstack.warehouse.repository.OrderPickItemRepository;
import com.shopstack.warehouse.repository.StockMovementRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PickupService {

    private static final String PACK_STAGING = "Pack staging";
    private static final String MOVEMENT_TYPE = "Pick";

    private static final Set<OrderStatus> PICKABLE = Set.of(OrderStatus.CONFIRMED, OrderStatus.PICKED);

    private final OrderFulfillmentPort orderFulfillmentPort;
    private final OrderPickItemRepository pickItemRepository;
    private final InventoryRowRepository inventoryRowRepository;
    private final StockMovementRepository stockMovementRepository;
    private final IdGenerator idGenerator;

    public PickupService(OrderFulfillmentPort orderFulfillmentPort,
                         OrderPickItemRepository pickItemRepository,
                         InventoryRowRepository inventoryRowRepository,
                         StockMovementRepository stockMovementRepository,
                         IdGenerator idGenerator) {
        this.orderFulfillmentPort = orderFulfillmentPort;
        this.pickItemRepository = pickItemRepository;
        this.inventoryRowRepository = inventoryRowRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.idGenerator = idGenerator;
    }

    @Transactional(readOnly = true)
    public List<PickupListItemDto> getQueue(String warehouseId, String stageFilter) {
        PickStage filter = parseStage(stageFilter);
        List<OrderStatus> statuses = switch (filter) {
            case TO_PICK -> List.of(OrderStatus.CONFIRMED);
            case PICKED -> List.of(OrderStatus.PICKED);
            case ALL -> List.of(OrderStatus.CONFIRMED, OrderStatus.PICKED);
        };

        Map<String, InventoryRow> stockBySku = primaryStockBySku(warehouseId);

        return statuses.stream()
                .flatMap(status -> orderFulfillmentPort
                        .findOrders(warehouseId, status, 0, Integer.MAX_VALUE).stream())
                .sorted(Comparator.comparing(OrderRecord::placedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(order -> toQueueItem(order, stockBySku))
                .toList();
    }

    @Transactional
    public PickListDto getPickList(String warehouseId, String orderId) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (order.status() == OrderStatus.PENDING) {
            throw new ConflictException("Order must be confirmed before picking.");
        }

        syncPickItems(order);

        List<OrderPickItem> rows = pickItemRepository.findByWarehouseIdAndOrderId(warehouseId, orderId);
        Map<String, InventoryRow> stockBySku = primaryStockBySku(warehouseId);
        Map<String, OrderItemRecord> lines = orderFulfillmentPort
                .findItems(warehouseId, orderId).stream()
                .collect(Collectors.toMap(OrderItemRecord::itemId, i -> i, (a, b) -> a));

        List<PickListDto.PickListItemDto> pickList = rows.stream()
                .map(row -> {
                    InventoryRow stock = stockBySku.get(row.getSku());
                    OrderItemRecord line = lines.get(row.getItemId());
                    return new PickListDto.PickListItemDto(
                            row.getItemId(),
                            row.getSku(),
                            line == null ? row.getSku() : line.productName(),
                            stock == null ? null : stock.getBin(),
                            row.getQty(),
                            Boolean.TRUE.equals(row.getPicked()));
                })
                .toList();

        return new PickListDto(orderId, warehouseId, stageFor(order.status()), pickList);
    }

    @Transactional
    public ActionResultDto toggleItem(String warehouseId, String orderId, String itemId, Boolean picked) {
        if (itemId == null || itemId.isBlank() || picked == null) {
            throw new UnprocessableException("Choose an item and whether it was picked.");
        }

        OrderRecord order = requireOrder(warehouseId, orderId);
        if (!PICKABLE.contains(order.status())) {
            throw new ConflictException("Order must be confirmed before picking.");
        }

        syncPickItems(order);

        OrderPickItem row = pickItemRepository.findByOrderIdAndItemId(orderId, itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found on this order."));

        row.setPicked(picked);
        row.setPickedAt(picked ? Instant.now() : null);
        row.setPickedBy(picked ? currentUser() : null);
        pickItemRepository.save(row);

        return ActionResultDto.okOnly();
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ActionResultDto complete(String warehouseId, String orderId) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (order.status() != OrderStatus.CONFIRMED) {
            throw new ConflictException("Order must be confirmed before picking.");
        }

        List<OrderPickItem> rows = pickItemRepository.findByOrderIdWithLock(orderId);
        if (rows.isEmpty() || rows.stream().anyMatch(r -> !Boolean.TRUE.equals(r.getPicked()))) {
            throw new ConflictException("Not all items have been picked.");
        }

        Map<String, InventoryRow> stockBySku = new LinkedHashMap<>();
        for (OrderPickItem row : rows) {
            stockBySku.computeIfAbsent(row.getSku(), sku -> primaryLockedRow(warehouseId, sku));
        }

        for (OrderPickItem row : rows) {
            InventoryRow stock = stockBySku.get(row.getSku());
            if (stock == null || stock.getQty() < row.getQty()) {
                String bin = stock == null ? null : stock.getBin();
                throw new ConflictException("Not enough stock in "
                        + (bin == null ? "the warehouse" : bin) + " to complete this pick.");
            }
        }

        String performedBy = currentUser();
        for (OrderPickItem row : rows) {
            InventoryRow stock = stockBySku.get(row.getSku());
            stock.setQty(stock.getQty() - row.getQty());
            inventoryRowRepository.save(stock);

            stockMovementRepository.save(StockMovement.builder()
                    .id(idGenerator.generateMovementId())
                    .warehouseId(warehouseId)
                    .sku(row.getSku())
                    .type(MOVEMENT_TYPE)
                    .fromLoc(stock.getBin())
                    .toLoc(PACK_STAGING)
                    .qty(row.getQty())
                    .performedBy(performedBy)
                    .at(Instant.now())
                    .build());

            inventoryRowRepository.deleteEmptyRowsInOtherBins(warehouseId, row.getSku(), stock.getBin());
        }

        orderFulfillmentPort.advanceStatus(warehouseId, orderId, order.status(), OrderStatus.PICKED);
        return ActionResultDto.of(OrderStatus.PICKED.wireValue());
    }

    private void syncPickItems(OrderRecord order) {
        List<OrderItemRecord> lines = orderFulfillmentPort.findItems(order.warehouseId(), order.orderId());
        List<OrderPickItem> existing = pickItemRepository
                .findByWarehouseIdAndOrderId(order.warehouseId(), order.orderId());
        Set<String> known = existing.stream().map(OrderPickItem::getItemId).collect(Collectors.toSet());

        List<OrderPickItem> added = lines.stream()
                .filter(line -> !known.contains(line.itemId()))
                .map(line -> OrderPickItem.builder()
                        .orderId(order.orderId())
                        .itemId(line.itemId())
                        .warehouseId(order.warehouseId())
                        .sku(line.sku())
                        .qty(line.qty())
                        .picked(false)
                        .build())
                .toList();

        if (!added.isEmpty()) {
            pickItemRepository.saveAll(added);
        }
    }

    private PickupListItemDto toQueueItem(OrderRecord order, Map<String, InventoryRow> stockBySku) {
        String binSummary = orderFulfillmentPort.findItems(order.warehouseId(), order.orderId()).stream()
                .map(line -> stockBySku.get(line.sku()))
                .filter(Objects::nonNull)
                .map(InventoryRow::getBin)
                .distinct()
                .sorted(Comparator.naturalOrder())
                .collect(Collectors.joining(", "));

        return new PickupListItemDto(
                order.orderId(),
                order.warehouseId(),
                stageFor(order.status()),
                order.customerName(),
                order.itemCount(),
                binSummary);
    }

    private Map<String, InventoryRow> primaryStockBySku(String warehouseId) {
        return inventoryRowRepository.findByWarehouseId(warehouseId).stream()
                .collect(Collectors.toMap(InventoryRow::getSku, r -> r,
                        (a, b) -> a.getQty() >= b.getQty() ? a : b));
    }

    private InventoryRow primaryLockedRow(String warehouseId, String sku) {
        List<InventoryRow> locked = inventoryRowRepository.findByWarehouseIdAndSkuForUpdate(warehouseId, sku);
        return locked.isEmpty() ? null : locked.get(0);
    }

    private PickStage stageFor(OrderStatus status) {
        return status == OrderStatus.PICKED ? PickStage.PICKED : PickStage.TO_PICK;
    }

    private OrderRecord requireOrder(String warehouseId, String orderId) {
        return orderFulfillmentPort.findOrder(warehouseId, orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
    }

    private PickStage parseStage(String filter) {
        return PickStage.fromWire(filter)
                .orElseThrow(() -> new UnprocessableException("Unknown pickup stage: " + filter));
    }

    private String currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? null : authentication.getName();
    }
}