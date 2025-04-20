package com.example.demo.Controller;

import com.example.demo.DTO.BookingDetailsDTO;
import com.example.demo.DTO.BookingRequest;
import com.example.demo.Entity.Booking;
import com.example.demo.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@RequestBody BookingRequest request) {
        List<UUID> bookingIds = bookingService.processBooking(request);
        if (!bookingIds.isEmpty()) {
            return ResponseEntity.ok(bookingIds);
        } else {
            return ResponseEntity.badRequest().body("Booking failed. Try again.");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<UUID>> getUserBookings(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getAllBookingId(userId));
    }
    @GetMapping("/user/{userId}/all")
    public ResponseEntity<List<Booking>> getAllBookings(@PathVariable UUID userId) {
        List<Booking> bookings = bookingService.getAllBookingsForUser(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/{userId}/details")
    public ResponseEntity<List<BookingDetailsDTO>> getAllBookingDetails(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getAllBookingDetailsForUser(userId));
    }
}