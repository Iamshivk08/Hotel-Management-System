package com.example.hotelbooking.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long roomId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "hotel_id")
    public Hotel hotel;

    public String roomType;
    public BigDecimal price;
    public Boolean availability;
}
