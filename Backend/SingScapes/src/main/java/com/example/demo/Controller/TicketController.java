package com.example.demo.Controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Ticket;
import com.example.demo.Service.TicketService;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // Get Ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable String id) {
        // Convert String id to UUID
        UUID ticketId = UUID.fromString(id);
        Optional<Ticket> ticket = ticketService.getTicketById(ticketId);
        return ticket.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get Tickets by Attraction ID
    @GetMapping("/attraction/{attractionId}")
    public List<Ticket> getTicketsByAttraction(@PathVariable UUID attractionId) {
        return ticketService.getTicketsByAttraction(attractionId);
    }

    // Create Ticket
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // Update Ticket
    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable String id, @RequestBody Ticket ticket) {
        UUID ticketId = UUID.fromString(id); // Convert String id to UUID
        return ticketService.updateTicket(ticketId, ticket);
    }

    // Delete Ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        UUID ticketId = UUID.fromString(id); // Convert String id to UUID
        ticketService.deleteTicket(ticketId);
        return ResponseEntity.noContent().build();
    }
}
