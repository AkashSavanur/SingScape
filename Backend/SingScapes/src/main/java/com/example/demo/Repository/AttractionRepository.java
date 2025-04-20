package com.example.demo.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Attraction;
import com.example.demo.Entity.User;

public interface AttractionRepository extends JpaRepository<Attraction, UUID> {
    Optional<Attraction> findByName(String name);
    Optional<Attraction> findById(UUID id);
    
    
    
}
