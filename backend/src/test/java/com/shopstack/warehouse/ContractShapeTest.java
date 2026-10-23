package com.shopstack.warehouse;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.common.enums.PackStage;
import com.shopstack.common.enums.PickStage;
import com.shopstack.warehouse.dto.response.ActionResultDto;
import com.shopstack.warehouse.dto.response.OrderDetailDto;
import com.shopstack.warehouse.dto.response.OrderListItemDto;
import com.shopstack.warehouse.dto.response.OrderSummaryDto;
import com.shopstack.warehouse.dto.response.PackupDetailDto;
import com.shopstack.warehouse.dto.response.PackupListItemDto;
import com.shopstack.warehouse.dto.response.PickListDto;
import com.shopstack.warehouse.dto.response.PickupListItemDto;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.json.JsonMapper;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * W-21 · Locks the wire shape of every customer-side response to the field names in
 * {@code Shop360 Warehouse Module_ Customer Side API Contract.md}.
 *
 * <p>The frontend binds to these names literally, so a rename here is a breaking change that
 * should fail CI rather than surface as an undefined field in a browser. Assertions are on the
 * serialised key set, not on values — values are covered by the three integration tests.
 */
class ContractShapeTest {

    private static final JsonMapper MAPPER = JsonMapper.builder().build();

    private static Set<String> keysOf(Object dto) {
        return new TreeSet<>(new java.util.ArrayList<>(
                MAPPER.valueToTree(dto).propertyNames()));
    }

    private static Set<String> keys(String... names) {
        return new TreeSet<>(List.of(names));
    }

    private static final LocalDate DATE = LocalDate.parse("2026-10-02");
    private static final Instant PLACED = Instant.parse("2026-10-01T10:12:00Z");

    @Test
    void orderListItemKeepsContractFields() {
        OrderListItemDto dto = new OrderListItemDto(
                "ORD-1", "WH-NORTH", OrderStatus.PENDING, "Priya Shah", "Pune", 2, DATE, PLACED);

        assertThat(keysOf(dto)).isEqualTo(keys(
                "orderId", "warehouseId", "status", "customerName", "city",
                "itemCount", "deliveryDate", "placedAt"));
    }

    @Test
    void orderDetailKeepsContractFields() {
        OrderDetailDto dto = new OrderDetailDto(
                "ORD-1", "WH-NORTH", OrderStatus.CONFIRMED, DATE, PLACED,
                new OrderDetailDto.CustomerDto("Priya Shah", "+91 98200 41231", "14 Marine Drive", "Mumbai"),
                List.of(new OrderDetailDto.OrderItemDto("SKU-1", "Widget", "B-01-04", 2, 32)));

        assertThat(keysOf(dto)).isEqualTo(keys(
                "orderId", "warehouseId", "status", "deliveryDate", "placedAt",
                "customer", "items"));
        assertThat(keysOf(dto.customer())).isEqualTo(keys("name", "phone", "addressLine", "city"));
        assertThat(keysOf(dto.items().get(0))).isEqualTo(keys(
                "sku", "productName", "binLocation", "qty", "stockOnHand"));
    }

    @Test
    void pickupQueueItemKeepsContractFields() {
        PickupListItemDto dto =
                new PickupListItemDto("ORD-1", "WH-NORTH", PickStage.TO_PICK, "Priya Shah", 2, "A-03-12, B-01-04");

        assertThat(keysOf(dto)).isEqualTo(keys(
                "orderId", "warehouseId", "stage", "customerName", "itemCount", "binSummary"));
    }

    @Test
    void pickListKeepsContractFields() {
        PickListDto dto = new PickListDto("ORD-1", "WH-NORTH", PickStage.TO_PICK,
                List.of(new PickListDto.PickListItemDto("ITEM-1", "SKU-1", "Widget", "B-01-04", 2, false)));

        assertThat(keysOf(dto)).isEqualTo(keys("orderId", "warehouseId", "stage", "pickList"));
        assertThat(keysOf(dto.pickList().get(0))).isEqualTo(keys(
                "itemId", "sku", "productName", "binLocation", "qty", "picked"));
    }

    @Test
    void packupQueueItemKeepsContractFields() {
        PackupListItemDto dto =
                new PackupListItemDto("ORD-1", "WH-NORTH", PackStage.TO_PACK, "Priya Shah", 2);

        assertThat(keysOf(dto)).isEqualTo(keys(
                "orderId", "warehouseId", "stage", "customerName", "itemCount"));
    }

    @Test
    void packupDetailAlwaysCarriesPackingAndOutbound() {
        PackupDetailDto dto = new PackupDetailDto("ORD-1", "WH-NORTH", PackStage.TO_PACK,
                new PackupDetailDto.PackingDto("small", 0.8, false),
                new PackupDetailDto.OutboundDto(null, null, false));

        assertThat(keysOf(dto)).isEqualTo(keys("orderId", "warehouseId", "stage", "packing", "outbound"));
        assertThat(keysOf(dto.packing())).isEqualTo(keys("boxSize", "weightKg", "packed"));
        assertThat(keysOf(dto.outbound())).isEqualTo(keys("carrier", "trackingId", "shipped"));
    }

    @Test
    void dashboardPipelineKeepsAllSevenSnakeCaseKeys() {
        OrderSummaryDto dto = new OrderSummaryDto(3,
                new OrderSummaryDto.PipelineDto(1, 2, 3, 4, 5, 6, 7));

        assertThat(keysOf(dto)).isEqualTo(keys("dueToday", "pipeline"));
        // out_for_delivery is snake_case on the wire, so it cannot be a record component name.
        assertThat(keysOf(dto.pipeline())).isEqualTo(keys(
                "pending", "confirmed", "picked", "packed", "shipped",
                "out_for_delivery", "delivered"));
    }

    @Test
    void actionResultsEmitOnlyTheFieldsEachActionDeclares() {
        assertThat(keysOf(ActionResultDto.okOnly())).isEqualTo(keys("ok"));
        assertThat(keysOf(ActionResultDto.of("packed"))).isEqualTo(keys("ok", "status"));
        assertThat(keysOf(ActionResultDto.shipped("shipped", "BD-2938471")))
                .isEqualTo(keys("ok", "status", "trackingId"));
    }
}
