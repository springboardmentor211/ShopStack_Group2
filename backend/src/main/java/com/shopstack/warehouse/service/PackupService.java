package com.shopstack.warehouse.service;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.common.enums.PackStage;
import com.shopstack.common.exception.ConflictException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.common.exception.UnprocessableException;
import com.shopstack.common.util.IdGenerator;
import com.shopstack.warehouse.dto.response.ActionResultDto;
import com.shopstack.warehouse.dto.response.PackupDetailDto;
import com.shopstack.warehouse.dto.response.PackupListItemDto;
import com.shopstack.warehouse.entity.OrderPacking;
import com.shopstack.warehouse.entity.StockMovement;
import com.shopstack.warehouse.port.OrderFulfillmentPort;
import com.shopstack.warehouse.port.dto.OrderItemRecord;
import com.shopstack.warehouse.port.dto.OrderRecord;
import com.shopstack.warehouse.repository.OrderPackingRepository;
import com.shopstack.warehouse.repository.StockMovementRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class PackupService {

    private static final Set<String> BOX_SIZES = Set.of("small", "medium", "large");
    private static final String PACK_STAGING = "Pack staging";

    private final OrderFulfillmentPort orderFulfillmentPort;
    private final OrderPackingRepository packingRepository;
    private final IdGenerator idGenerator;
    private final StockMovementRepository stockMovementRepository;

    public PackupService(OrderFulfillmentPort orderFulfillmentPort,
                         OrderPackingRepository packingRepository,
                         IdGenerator idGenerator,
                         StockMovementRepository stockMovementRepository) {
        this.orderFulfillmentPort = orderFulfillmentPort;
        this.packingRepository = packingRepository;
        this.idGenerator = idGenerator;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Transactional(readOnly = true)
    public List<PackupListItemDto> getQueue(String warehouseId, String stageFilter) {
        PackStage filter = parseStage(stageFilter);
        List<OrderStatus> statuses = switch (filter) {
            case TO_PACK -> List.of(OrderStatus.PICKED);
            case PACKED, READY_TO_SHIP -> List.of(OrderStatus.PACKED);
            case SHIPPED -> List.of(OrderStatus.SHIPPED);
            case ALL -> List.of(OrderStatus.PICKED, OrderStatus.PACKED, OrderStatus.SHIPPED);
        };

        return statuses.stream()
                .flatMap(status -> orderFulfillmentPort
                        .findOrders(warehouseId, status, 0, Integer.MAX_VALUE).stream())
                .sorted(Comparator.comparing(OrderRecord::placedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(order -> new PackupListItemDto(
                        order.orderId(),
                        order.warehouseId(),
                        stageFor(order.status(), filter),
                        order.customerName(),
                        order.itemCount()))
                .toList();
    }

    @Transactional
    public PackupDetailDto getDetail(String warehouseId, String orderId) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (order.status() == OrderStatus.PENDING || order.status() == OrderStatus.CONFIRMED) {
            throw new ConflictException("Order has not been picked yet.");
        }
        return toDetail(order, packingRow(warehouseId, orderId), stageFor(order.status(), null));
    }

    @Transactional
    public ActionResultDto pack(String warehouseId, String orderId, String boxSize, Double weightKg) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (order.status() != OrderStatus.PICKED) {
            throw new ConflictException("Order must be picked before packing.");
        }
        if (!isValidBox(boxSize, weightKg)) {
            throw new UnprocessableException("Enter a valid box size and weight.");
        }

        OrderPacking packing = packingRow(warehouseId, orderId);
        packing.setBoxSize(boxSize.trim().toLowerCase(Locale.ROOT));
        packing.setWeightKg(BigDecimal.valueOf(weightKg));
        packing.setPacked(true);
        packing.setPackedAt(Instant.now());
        packingRepository.save(packing);

        orderFulfillmentPort.advanceStatus(warehouseId, orderId, OrderStatus.PICKED, OrderStatus.PACKED);
        logOrderMovement(warehouseId, orderId, "Pack", PACK_STAGING, orderId + " · Packed");
        return ActionResultDto.of(OrderStatus.PACKED.wireValue());
    }

    @Transactional
    public ActionResultDto ship(String warehouseId, String orderId, String carrier) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (order.status() != OrderStatus.PACKED) {
            throw new ConflictException("Order must be packed before shipping.");
        }
        if (carrier == null || carrier.isBlank()) {
            throw new UnprocessableException("Choose a carrier.");
        }

        OrderPacking packing = packingRow(warehouseId, orderId);
        if (packing.getTrackingId() == null || packing.getTrackingId().isBlank()) {
            packing.setTrackingId(idGenerator.generateTrackingId(carrier));
        }
        packing.setCarrier(carrier.trim());
        packing.setShipped(true);
        packing.setShippedAt(Instant.now());
        packingRepository.save(packing);

        orderFulfillmentPort.advanceStatus(warehouseId, orderId, OrderStatus.PACKED, OrderStatus.SHIPPED);
        return ActionResultDto.shipped(OrderStatus.SHIPPED.wireValue(), packing.getTrackingId());
    }

    private void logOrderMovement(String warehouseId, String orderId, String type, String from, String to) {
        String performedBy = currentUser();
        for (OrderItemRecord item : orderFulfillmentPort.findItems(warehouseId, orderId)) {
            stockMovementRepository.save(StockMovement.builder()
                    .id(idGenerator.generateMovementId())
                    .warehouseId(warehouseId)
                    .sku(item.sku())
                    .type(type)
                    .fromLoc(from)
                    .toLoc(to)
                    .qty(item.qty())
                    .performedBy(performedBy)
                    .at(Instant.now())
                    .build());
        }
    }

    private String currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? null : authentication.getName();
    }

    private PackupDetailDto toDetail(OrderRecord order, OrderPacking packing, PackStage stage) {
        return new PackupDetailDto(
                order.orderId(),
                order.warehouseId(),
                stage,
                new PackupDetailDto.PackingDto(
                        packing.getBoxSize(),
                        packing.getWeightKg() == null ? null : packing.getWeightKg().doubleValue(),
                        Boolean.TRUE.equals(packing.getPacked())),
                new PackupDetailDto.OutboundDto(
                        packing.getCarrier(),
                        packing.getTrackingId(),
                        Boolean.TRUE.equals(packing.getShipped())));
    }

    private OrderPacking packingRow(String warehouseId, String orderId) {
        return packingRepository.findByOrderIdAndWarehouseId(orderId, warehouseId)
                .orElseGet(() -> OrderPacking.builder()
                        .orderId(orderId)
                        .warehouseId(warehouseId)
                        .packed(false)
                        .shipped(false)
                        .build());
    }

    private PackStage stageFor(OrderStatus status, PackStage filter) {
        return switch (status) {
            case PICKED -> PackStage.TO_PACK;
            case PACKED -> filter == PackStage.PACKED ? PackStage.PACKED : PackStage.READY_TO_SHIP;
            default -> PackStage.SHIPPED;
        };
    }

    private boolean isValidBox(String boxSize, Double weightKg) {
        return boxSize != null
                && BOX_SIZES.contains(boxSize.trim().toLowerCase(Locale.ROOT))
                && weightKg != null
                && weightKg > 0;
    }

    private OrderRecord requireOrder(String warehouseId, String orderId) {
        return orderFulfillmentPort.findOrder(warehouseId, orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
    }

    private PackStage parseStage(String filter) {
        return PackStage.fromWire(filter)
                .orElseThrow(() -> new UnprocessableException("Unknown packup stage: " + filter));
    }
}