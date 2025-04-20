package com.example.demo.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Attraction;
import com.example.demo.Entity.Review;
import com.example.demo.Repository.AttractionRepository;
import com.example.demo.Repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Autowired
    private AttractionRepository attractionRepository;

    @Autowired
    private AttractionService attractionService;

    // Method to create a new review
    public Review createReview(Review review) {
        // 1. Save the new review
        Review savedReview = reviewRepository.save(review);
    
        // 2. Fetch all reviews for this attraction
        UUID attractionId = review.getAttraction().getId();
        List<Review> allReviews = reviewRepository.findAllByAttraction_Id(attractionId);
    
        // 3. Calculate average rating
        double avgRating = allReviews.stream()
                                     .mapToDouble(Review::getRating)
                                     .average()
                                     .orElse(0.0);
    
        // 4. Fetch the full Attraction from DB before updating
        Attraction fullAttraction = attractionRepository.findById(attractionId).orElseThrow(() -> new RuntimeException("Attraction not found"));
    
        fullAttraction.setRating(avgRating);
        attractionRepository.save(fullAttraction); // or use service method
    
        return savedReview;
    }

    // Method to get all reviews for a specific attraction
    public List<Review> getReviewsByAttractionId(UUID attractionId) {
        return reviewRepository.findAllByAttraction_Id(attractionId);
    }

    // Method to get a specific review by its ID
    public Optional<Review> getReviewById(UUID reviewId) {
        return reviewRepository.findById(reviewId);
    }

    // Method to update a review
    public Review updateReview(UUID reviewId, Review updatedReview) {
        // 1. Fetch the existing review
        Review existingReview = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));
    
        // 2. Update fields
        existingReview.setRating(updatedReview.getRating());
        existingReview.setText(updatedReview.getText());
        existingReview.setUpdatedAt(LocalDateTime.now());
    
        // 3. Save updated review
        Review savedReview = reviewRepository.save(existingReview);
    
        // 4. Recalculate average for the attraction
        UUID attractionId = existingReview.getAttraction().getId();
        List<Review> allReviews = reviewRepository.findAllByAttraction_Id(attractionId);
        double avgRating = allReviews.stream()
                                     .mapToDouble(Review::getRating)
                                     .average()
                                     .orElse(0.0);
    
        // 5. Update the attraction
        Attraction attraction = attractionRepository.findById(attractionId)
            .orElseThrow(() -> new RuntimeException("Attraction not found"));
        attraction.setRating(avgRating);
        attractionRepository.save(attraction);
    
        return savedReview;
    }
    

    // Method to delete a review
    public boolean deleteReview(UUID reviewId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
    
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            UUID attractionId = review.getAttraction().getId();
    
            // 1. Delete the review
            reviewRepository.deleteById(reviewId);
    
            // 2. Fetch remaining reviews for the attraction
            List<Review> allReviews = reviewRepository.findAllByAttraction_Id(attractionId);
            double avgRating = allReviews.stream()
                                         .mapToDouble(Review::getRating)
                                         .average()
                                         .orElse(0.0);
    
            // 3. Update the attraction rating
            Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new RuntimeException("Attraction not found"));
            attraction.setRating(avgRating);
            attractionRepository.save(attraction);
    
            return true;
        }
    
        return false;
    }
    

    // Method to flag a review as inappropriate
    public Optional<Review> flagReview(UUID reviewId) {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isPresent()) {
            Review review = reviewOptional.get();
            review.setFlagged(true);
            return Optional.of(reviewRepository.save(review));
        }
        return Optional.empty();
    }

    // Method to get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
