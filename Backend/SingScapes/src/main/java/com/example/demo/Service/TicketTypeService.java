package com.example.demo.Service;

import com.example.demo.DTO.TicketTypeRequest;
import com.example.demo.Entity.Attraction;
import com.example.demo.Entity.TicketType;
import com.example.demo.Repository.AttractionRepository;
import com.example.demo.Repository.TicketTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TicketTypeService {

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private AttractionRepository attractionRepository;

    public List<TicketType> getTicketTypesByAttraction(UUID attractionId) {
        return ticketTypeRepository.findByAttraction_Id(attractionId);
    }

    public TicketType createTicketType(UUID attractionId, String type, String price, int quantity) {
        Optional<Attraction> attractionOpt = attractionRepository.findById(attractionId);
        if (attractionOpt.isEmpty()) {
            throw new RuntimeException("Attraction not found");
        }

        TicketType ticketType = new TicketType();
        ticketType.setAttraction(attractionOpt.get());
        ticketType.setType(type);
        ticketType.setPrice(price);
        ticketType.setQuantity(quantity);

        return ticketTypeRepository.save(ticketType);
    }

    public void deleteTicketType(UUID id) {
        ticketTypeRepository.deleteById(id);
    }

    public void addTicketTypesBulk(List<TicketTypeRequest> ticketRequests) {
        for (TicketTypeRequest req : ticketRequests) {
            TicketType ticketType = new TicketType();
            ticketType.setAttraction(
                attractionRepository.findById(req.getAttractionId())
                    .orElseThrow(() -> new RuntimeException("Attraction not found"))
            );
            ticketType.setType(req.getType());
            ticketType.setPrice(req.getPrice());
            ticketType.setQuantity(req.getQuantity());
    
            ticketTypeRepository.save(ticketType);
        }
    }
    public void deductTicketByAttributes(UUID attractionId, String type, String price) {
        TicketType ticketType = ticketTypeRepository
            .findByAttraction_IdAndTypeAndPrice(attractionId, type, price)
            .orElseThrow(() -> new RuntimeException("TicketType not found for given attributes"));
    
        if (ticketType.getQuantity() <= 0) {
            throw new RuntimeException("No more tickets available for " + type);
        }
    
        ticketType.setQuantity(ticketType.getQuantity() - 1);
        ticketTypeRepository.save(ticketType);
    }

    public TicketType getTicketTypeByAttractionAndType(UUID attractionId, String type) {
        return ticketTypeRepository
            .findByAttraction_IdAndType(attractionId, type)
            .orElseThrow(() -> new RuntimeException("TicketType not found for attraction: " + attractionId + ", type: " + type));
    }
    
    

    
}
