package com.example.hotelbooking.controller;

import com.example.hotelbooking.model.Booking;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.service.BookingRequest;
import com.example.hotelbooking.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public BookingController(BookingRepository bookingRepository, BookingService bookingService) {
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> allBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Booking> bookingHistory(@PathVariable Long userId) {
        return bookingRepository.findByUserUserId(userId);
    }

    @PostMapping
    public Booking bookRoom(@RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }
}
