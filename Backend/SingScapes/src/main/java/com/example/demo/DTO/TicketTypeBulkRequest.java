package com.example.demo.DTO;

import java.util.List;

public class TicketTypeBulkRequest {
    private List<TicketTypeRequest> ticketTypes;

    public List<TicketTypeRequest> getTicketTypes() {
        return ticketTypes;
    }

    public void setTicketTypes(List<TicketTypeRequest> ticketTypes) {
        this.ticketTypes = ticketTypes;
    }
}
