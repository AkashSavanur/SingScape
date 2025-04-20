package com.example.demo.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Ticket;
import com.example.demo.Repository.TicketRepository;

import jakarta.transaction.Transactional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    //Get Ticket by ID
    public Optional<Ticket> getTicketById(UUID id) {
        return ticketRepository.findById(id);
    }

    // Get all Tickets for a specific Attraction
    public List<Ticket> getTicketsByAttraction(UUID attractionId) {
        return ticketRepository.findAllByAttraction_Id(attractionId);
    }

    // Create Ticket
    @Transactional
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    //Update Ticket
    @Transactional
    public Ticket updateTicket(UUID id, Ticket updatedTicket) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setType(updatedTicket.getType());
            ticket.setPrice(updatedTicket.getPrice());
            ticket.setDate(updatedTicket.getDate());
            ticket.setAttraction(updatedTicket.getAttraction());
            return ticketRepository.save(ticket);
        }).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    //Delete Ticket
    @Transactional
    public void deleteTicket(UUID id) {
        ticketRepository.deleteById(id);
    }
}
