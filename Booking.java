package com.example.hotelbooking.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long bookingId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    public User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "room_id")
    public Room room;

    public LocalDate checkIn;
    public LocalDate checkOut;
    public BigDecimal totalAmount;
    public String status;
}
