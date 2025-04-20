package com.example.demo.Controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Review;
import com.example.demo.Service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Create a new review
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review createdReview = reviewService.createReview(review);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    // Get all reviews for a specific attraction
    @GetMapping("/attraction/{attractionId}")
    public ResponseEntity<List<Review>> getReviewsByAttractionId(@PathVariable UUID attractionId) {
        List<Review> reviews = reviewService.getReviewsByAttractionId(attractionId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // Get a specific review by its ID
    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable UUID reviewId) {
        Optional<Review> review = reviewService.getReviewById(reviewId);
        return review.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a review
    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable UUID reviewId, @RequestBody Review updatedReview) {
        try {
            Review review = reviewService.updateReview(reviewId, updatedReview);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable UUID reviewId) {
        boolean deleted = reviewService.deleteReview(reviewId);
        if(deleted) {
            return ResponseEntity.ok("Review with ID " + reviewId + " deleted successfully");
        } else { 
            return ResponseEntity.notFound().build();
        }
    } 

    // Flag a review as inappropriate
    @PatchMapping("/{reviewId}/flag")
    public ResponseEntity<Review> flagReview(@PathVariable UUID reviewId) {
        Optional<Review> flaggedReview = reviewService.flagReview(reviewId);
        return flaggedReview.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get all reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
}

