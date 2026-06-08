package com.example.hotelbooking.service;

import com.example.hotelbooking.model.Booking;
import com.example.hotelbooking.model.Payment;
import com.example.hotelbooking.model.Room;
import com.example.hotelbooking.model.User;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.repository.PaymentRepository;
import com.example.hotelbooking.repository.RoomRepository;
import com.example.hotelbooking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            RoomRepository roomRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    public Booking createBooking(BookingRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        if (!Boolean.TRUE.equals(room.availability)) {
            throw new IllegalStateException("Room is not available");
        }

        long nights = Math.max(1, ChronoUnit.DAYS.between(request.checkIn(), request.checkOut()));
        BigDecimal total = room.price.multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.user = user;
        booking.room = room;
        booking.checkIn = request.checkIn();
        booking.checkOut = request.checkOut();
        booking.totalAmount = total;
        booking.status = "CONFIRMED";
        Booking savedBooking = bookingRepository.save(booking);

        Payment payment = new Payment();
        payment.booking = savedBooking;
        payment.amount = total;
        payment.paymentMethod = request.paymentMethod();
        payment.paymentStatus = "SUCCESS";
        paymentRepository.save(payment);

        return savedBooking;
    }
}
