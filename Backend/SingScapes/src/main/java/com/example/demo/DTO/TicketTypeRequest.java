package com.example.demo.DTO;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TicketTypeRequest {
    private UUID attractionId;
    private String type;
    private String price;
    private int quantity;

    
}
