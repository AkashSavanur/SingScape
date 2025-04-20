package com.example.demo.DTO;

import com.example.demo.Enum.PaymentMethod;
import java.util.UUID;

public class PaymentRequest {
    private UUID userId;
    private UUID bookingId;
    private PaymentMethod method;
    private String action; // e.g., "CONFIRM"

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getBookingId() { return bookingId; }
    public void setBookingId(UUID bookingId) { this.bookingId = bookingId; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
