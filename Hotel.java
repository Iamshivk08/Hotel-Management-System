package com.example.hotelbooking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long hotelId;

    public String hotelName;
    public String location;
    @Column(length = 1000)
    public String description;
    public Double rating;
}
