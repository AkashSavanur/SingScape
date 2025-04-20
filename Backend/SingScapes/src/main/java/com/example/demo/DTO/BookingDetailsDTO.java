package com.example.demo.DTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.example.demo.Enum.BookingStatus;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BookingDetailsDTO {
    private UUID bookingId;
    private String userName;
    private String userEmail;
    private String attractionName;
    private int ticketCount;
    private String ticketType;
    private String visitDate;
    private String price;
    private LocalDateTime bookingTime;
    private List<TicketDTO> tickets;
    private BookingStatus status;
}
