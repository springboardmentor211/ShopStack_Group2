package com.oneshop.modal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("order")
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    private Double totalAmount;

    private String status; // e.g., PENDING, PLACED, SHIPPED, DELIVERED, CANCELLED

    private LocalDateTime orderDate;

    @PrePersist
    public void onCreate() {
        this.orderDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PLACED";
        }
    }
}