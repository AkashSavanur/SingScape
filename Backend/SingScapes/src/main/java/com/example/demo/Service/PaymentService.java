package com.example.demo.Service;

import com.example.demo.DTO.PaymentRequest;
import com.example.demo.Entity.Booking;
import com.example.demo.Entity.Payment;
import com.example.demo.Entity.User;
import com.example.demo.Enum.BookingStatus;
import com.example.demo.Enum.PaymentMethod;
import com.example.demo.Repository.BookingRepository;
import com.example.demo.Repository.PaymentRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentGateway paymentGateway;

    @Autowired
    private BookingService bookingService;

    public boolean verifyUser(UUID userId) {
        return userRepository.findById(userId).isPresent();
    }

    public boolean processPayment(PaymentRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        Optional<Booking> bookingOpt = bookingRepository.findById(request.getBookingId());

        Booking booking = bookingOpt.get();

        if (userOpt.isEmpty() || bookingOpt.isEmpty()) return false;

        boolean confirmed = paymentGateway.confirmTransaction(request.getMethod(), request.getAction());
        if (!confirmed) return false;

        Payment payment = new Payment();
        payment.setUser(userOpt.get());
        payment.setBooking(bookingOpt.get());
        payment.setPaymentMethod(request.getMethod().name());
        payment.setPaymentStatus("SUCCESS");
        payment.setTimestamp(LocalDateTime.now());


        
        paymentRepository.save(payment);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        

        return true;
    }
}