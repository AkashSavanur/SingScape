package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.demo.Enum.BookingStatus;

@Entity
@Getter
@Setter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;  // ✅ UUID as ID

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "attraction_id", referencedColumnName = "id")
    private Attraction attraction;

    private int ticketCount;
    private String ticketType;
    private String visitDate;
    private String price;

    private LocalDateTime bookingTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus Status;
    

}
