package com.example.hotelbooking.controller;

import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.repository.HotelRepository;
import com.example.hotelbooking.repository.PaymentRepository;
import com.example.hotelbooking.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public AdminController(
            UserRepository userRepository,
            HotelRepository hotelRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository
    ) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        BigDecimal revenue = paymentRepository.findAll().stream()
                .map(payment -> payment.amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "users", userRepository.count(),
                "hotels", hotelRepository.count(),
                "bookings", bookingRepository.count(),
                "revenue", revenue
        );
    }
}
