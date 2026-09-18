package com.oneshop.modal;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Builder.Default
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    @Builder.Default
    private Double totalAmount = 0.0;

    @Builder.Default
    private Double discountAmount = 0.0;

   @Builder.Default
    private Double finalAmount = 0.0;

    private String appliedCouponCode;

    // Helper method to recalculate cart total
    // Helper method to recalculate cart total
    public void updateTotals() {
        if (this.discountAmount == null) {
            this.discountAmount = 0.0;
        }

        if (this.items != null) {
            this.totalAmount = items.stream()
                    .mapToDouble(item -> item.getTotalPrice() != null ? item.getTotalPrice() : 0.0)
                    .sum();
        } else {
            this.totalAmount = 0.0;
        }

        this.finalAmount = Math.max(0.0, this.totalAmount - this.discountAmount);
    }
}