package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "ticket_type")
public class TicketType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "attraction_id", referencedColumnName = "id")
    private Attraction attraction;

    @Column(nullable = false)
    private String type;  // e.g., "Adult", "Child", "Senior"

    @Column(nullable = false)
    private String price;  // Keep as string for now, or use BigDecimal

    @Column(nullable = false)
    private int quantity;

    public int getQuantity()
    {
        return this.quantity;
    }

    
}
