package com.example.demo.Entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;  // Supabase-provided, externally managed

    @Column(nullable = true)
    private String full_name;

    @Column(nullable = true)
    private String email;

    private String phone_number;

    private Boolean is_admin;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "user_booking_ids",
        joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "booking_id")
    private Set<UUID> bookingIds;  // ✅ Consistent UUID references

    @Column(name = "is_banned", nullable = false)
    private boolean isBanned;
}
