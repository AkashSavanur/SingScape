package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "partners")
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String email;

    private String phone;

    private String organization;

    private String website;

    private String partnershipType; // e.g., "Sponsor", "Vendor", "Affiliate"

    private String status; // e.g., "Active", "Inactive"
}
