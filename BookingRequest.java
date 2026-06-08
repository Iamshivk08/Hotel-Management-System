package com.example.hotelbooking.service;

import java.time.LocalDate;

public record BookingRequest(
        Long userId,
        Long roomId,
        LocalDate checkIn,
        LocalDate checkOut,
        String paymentMethod
) {
}
