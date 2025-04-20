package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)  // use AUTO or UUID generator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    
    private User user;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime timestamp;
}
