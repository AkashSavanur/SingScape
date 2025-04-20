package com.example.demo.Controller;

import com.example.demo.DTO.TicketTypeBulkRequest;
import com.example.demo.Entity.TicketType;
import com.example.demo.Service.TicketTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/ticket-types")
public class TicketTypeController {

    @Autowired
    private TicketTypeService ticketTypeService;

    // Get all ticket types for an attraction
    @GetMapping("/{attractionId}")
    public ResponseEntity<List<TicketType>> getByAttraction(@PathVariable UUID attractionId) {
        List<TicketType> types = ticketTypeService.getTicketTypesByAttraction(attractionId);
        return ResponseEntity.ok(types);
    }

    // Create new ticket type
    @PostMapping("/add")
public ResponseEntity<TicketType> addTicketType(@RequestBody Map<String, Object> body) {
    UUID attractionId = UUID.fromString((String) body.get("attractionId"));
    String type = (String) body.get("type");
    String price = (String) body.get("price");
    int quantity = (int) body.get("quantity");

    TicketType created = ticketTypeService.createTicketType(attractionId, type, price, quantity);
    return ResponseEntity.ok(created);
}

    // Delete a ticket type by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicketType(@PathVariable UUID id) {
        ticketTypeService.deleteTicketType(id);
        return ResponseEntity.ok("Ticket type deleted successfully");
    }
    @PostMapping("/add-bulk")
    public ResponseEntity<String> addTicketTypesBulk(@RequestBody TicketTypeBulkRequest bulkRequest) {
        ticketTypeService.addTicketTypesBulk(bulkRequest.getTicketTypes());
        return ResponseEntity.ok("Ticket types added successfully.");
    }

}
