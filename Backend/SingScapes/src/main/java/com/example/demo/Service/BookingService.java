package com.example.demo.Service;

import com.example.demo.DTO.BookingDetailsDTO;
import com.example.demo.DTO.BookingRequest;
import com.example.demo.DTO.TicketDTO;
import com.example.demo.DTO.TicketRequest;
import com.example.demo.Entity.Attraction;
import com.example.demo.Entity.Booking;
import com.example.demo.Entity.Payment;
import com.example.demo.Entity.Ticket;
import com.example.demo.Entity.TicketType;
import com.example.demo.Entity.User;
import com.example.demo.Enum.BookingStatus;
import com.example.demo.Repository.AttractionRepository;
import com.example.demo.Repository.BookingRepository;
import com.example.demo.Repository.PaymentRepository;
import com.example.demo.Repository.TicketRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttractionRepository attractionRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketTypeService ticketTypeService;


    public List<UUID> processBooking(BookingRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) return Collections.emptyList();
        User user = userOpt.get();
    
        // Get the attraction (assuming consistent across all tickets)
        UUID attractionId = request.getTicketRequests().get(0).getAttractionId();
        Optional<Attraction> attractionOpt = attractionRepository.findById(attractionId);
        if (attractionOpt.isEmpty()) return Collections.emptyList();
    
        Attraction attraction = attractionOpt.get();
    
        int totalTicketCount = 0;
        double totalPrice = 0.0;
    
        // Step 1: Compute total ticket count and price from TicketType table
        for (TicketRequest tr : request.getTicketRequests()) {
            int count = tr.getTicketCount();
    
            TicketType ticketType = ticketTypeService.getTicketTypeByAttractionAndType(tr.getAttractionId(), tr.getType());
            double price = Double.parseDouble(ticketType.getPrice());
    
            totalTicketCount += count;
            totalPrice += count * price;
        }
    
        // Step 2: Create Booking object
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setAttraction(attraction);
        booking.setBookingTime(LocalDateTime.now());
        booking.setTicketCount(totalTicketCount);
        booking.setTicketType("Mixed"); // optional
        booking.setVisitDate("Multiple"); // optional
        booking.setPrice(String.format("%.2f", totalPrice)); // store as formatted string
        booking.setStatus(BookingStatus.PENDING);
    
        booking = bookingRepository.save(booking);
        
    
        // Step 3: Save individual tickets and deduct quantity
        for (TicketRequest ticketRequest : request.getTicketRequests()) {
            for (int i = 0; i < ticketRequest.getTicketCount(); i++) {
                TicketType ticketType = ticketTypeService.getTicketTypeByAttractionAndType(
                    ticketRequest.getAttractionId(), ticketRequest.getType());
    
                // Deduct 1 ticket
                ticketTypeService.deductTicketByAttributes(
                    ticketRequest.getAttractionId(),
                    ticketRequest.getType(),
                    ticketType.getPrice() // use DB price
                );
    
                Ticket ticket = new Ticket();
                ticket.setBooking(booking);
                ticket.setAttraction(attractionRepository.findById(ticketRequest.getAttractionId()).orElse(attraction));
                ticket.setType(ticketRequest.getType());
                ticket.setPrice(ticketType.getPrice());
                ticket.setDate(ticketRequest.getDate());
    
                ticketRepository.save(ticket);
            }
        }
    
        // Step 4: Add booking ID to user and save
        user.getBookingIds().add(booking.getId());
        userRepository.save(user);
    
        return List.of(booking.getId());
    }
    

    public List<UUID> getAllBookingId(UUID userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        List<UUID> bookingIds = new ArrayList<>();
        for (Booking booking : bookings) {
            bookingIds.add(booking.getId());
        }
        return bookingIds;
    }
    public List<Booking> getAllBookingsForUser(UUID userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<BookingDetailsDTO> getAllBookingDetailsForUser(UUID userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        List<BookingDetailsDTO> bookingDTOs = new ArrayList<>();
    
        for (Booking booking : bookings) {
            BookingDetailsDTO dto = new BookingDetailsDTO();
            dto.setBookingId(booking.getId());
            dto.setUserName(booking.getUser().getFull_name());
            dto.setUserEmail(booking.getUser().getEmail());
            dto.setAttractionName(booking.getAttraction().getName());
            dto.setTicketCount(booking.getTicketCount());
            dto.setTicketType(booking.getTicketType());
            dto.setVisitDate(booking.getVisitDate());
            dto.setPrice(booking.getPrice());
            dto.setBookingTime(booking.getBookingTime());
            dto.setStatus(booking.getStatus());
    
            List<Ticket> tickets = ticketRepository.findByBooking(booking);
            List<TicketDTO> ticketDTOs = tickets.stream().map(ticket -> {
                TicketDTO t = new TicketDTO();
                t.setType(ticket.getType());
                t.setDate(ticket.getDate());
                t.setPrice(ticket.getPrice());
                return t;
            }).collect(Collectors.toList());
    
            dto.setTickets(ticketDTOs);
            bookingDTOs.add(dto);
        }
    
        return bookingDTOs;
    }
}