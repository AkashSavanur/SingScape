package com.example.demo.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Review;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    
    List<Review> findAllByAttraction_Id(UUID attractionId);
}
