package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "ticket") // Ensure this matches your database table
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private String type;  
    private String price;
    private String date;

    @ManyToOne
    @JoinColumn(name = "attraction_id", referencedColumnName = "id")
    private Attraction attraction;

    // Add constructors, getters, setters, etc.
}
