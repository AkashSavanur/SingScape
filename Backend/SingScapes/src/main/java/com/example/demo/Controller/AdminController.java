package com.example.demo.Controller;

import com.example.demo.Service.*;
import com.example.demo.DTO.BookingDetailsDTO;
import com.example.demo.Entity.*; // Assuming these exist
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/adminss")
public class AdminController {

    @Autowired private UserService userService;
    @Autowired private PartnerService partnerService;
    @Autowired private AttractionService attractionService;
    @Autowired private BookingService bookingService;
    @Autowired private PaymentService paymentService;
    @Autowired private PaymentGateway paymentGateway;
    @Autowired private ReviewService reviewService;
    @Autowired private TicketService ticketService;
    @Autowired private TicketTypeService ticketTypeService;
    @Autowired private ExternalDataService externalDataService;
    @Autowired private STBClientService stbClientService;


    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(user);
    }


    @GetMapping("/partners")
    public List<Partner> getAllPartners() {
        return partnerService.getAllPartners();
    }

    @PostMapping("/partners")
    public Partner addPartner(@RequestBody Partner partner) {
        return partnerService.createPartner(partner);
    }

    @PutMapping("/partners/{id}")
    public Partner updatePartner(@PathVariable UUID id, @RequestBody Partner partner) {
        return partnerService.updatePartner(id, partner);
    }

    @DeleteMapping("/partners/{id}")
    public void deletePartner(@PathVariable UUID id) {
        partnerService.deletePartner(id);
    }

    @GetMapping("/attractions")
    public List<Attraction> getAllAttractions() {
        return attractionService.getAllAttractions();
    }

    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @DeleteMapping("/reviews/{id}")
    public void deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
    }

    @PutMapping("/reviews/flag/{id}")
    public void flagReview(@PathVariable UUID id) {
        reviewService.flagReview(id);
    }

    @PutMapping("/reviews/unflag/{id}")
    public void unflagReview(@PathVariable UUID id) {
        reviewService.flagReview(id);
    }

    @GetMapping("/bookings/{id}")
    public List<BookingDetailsDTO> getAllBookings(@PathVariable UUID id) {
        return bookingService.getAllBookingDetailsForUser(id);
    }

    @GetMapping("/tickets/{id}")
    public List<Ticket> getAllTickets(@PathVariable UUID id) {
        return ticketService.getTicketsByAttraction(id);
    }

    @GetMapping("/ticket-types/{id}")
    public List<TicketType> getAllTicketTypes(@PathVariable UUID id) {
        return ticketTypeService.getTicketTypesByAttraction(id);
    }

    

}
