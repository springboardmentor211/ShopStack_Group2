package com.shopstack.warehouse.service;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.warehouse.dto.response.OrderSummaryDto;
import com.shopstack.warehouse.port.OrderFulfillmentPort;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class OrderSummaryService {

    private final OrderFulfillmentPort orderFulfillmentPort;

    public OrderSummaryService(OrderFulfillmentPort orderFulfillmentPort) {
        this.orderFulfillmentPort = orderFulfillmentPort;
    }

    public OrderSummaryDto getSummary(String warehouseId) {
        Map<OrderStatus, Integer> counts = orderFulfillmentPort.countByStatus(warehouseId);
        return new OrderSummaryDto(
                orderFulfillmentPort.countDueToday(warehouseId),
                new OrderSummaryDto.PipelineDto(
                        count(counts, OrderStatus.PENDING),
                        count(counts, OrderStatus.CONFIRMED),
                        count(counts, OrderStatus.PICKED),
                        count(counts, OrderStatus.PACKED),
                        count(counts, OrderStatus.SHIPPED),
                        count(counts, OrderStatus.OUT_FOR_DELIVERY),
                        count(counts, OrderStatus.DELIVERED)
                )
        );
    }

    private int count(Map<OrderStatus, Integer> counts, OrderStatus status) {
        return counts.getOrDefault(status, 0);
    }
}
