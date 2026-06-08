package com.example.hotelbooking.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long paymentId;

    @OneToOne(optional = false)
    @JoinColumn(name = "booking_id")
    public Booking booking;

    public BigDecimal amount;
    public String paymentMethod;
    public String paymentStatus;
}
