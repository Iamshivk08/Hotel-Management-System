package com.example.hotelbooking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long userId;

    public String name;
    @Column(unique = true, nullable = false)
    public String email;
    public String password;
    public String phone;
    public String role;
}
