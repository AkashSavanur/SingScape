package com.example.demo.Service;

import com.example.demo.Enum.PaymentMethod;
import org.springframework.stereotype.Component;

@Component
public class PaymentGateway {

    public boolean confirmTransaction(PaymentMethod method, String action) {
        if (!"CONFIRM".equalsIgnoreCase(action)) return false;

        switch (method) {
            case VISA:
                System.out.println("Processing VISA payment...");
                break;
            case PAYNOW:
                System.out.println("Processing PayNow transfer...");
                break;
            case PAYPAL:
                System.out.println("Processing PayPal transaction...");
                break;
            default:
                return false;
        }
        return true;
    }
}