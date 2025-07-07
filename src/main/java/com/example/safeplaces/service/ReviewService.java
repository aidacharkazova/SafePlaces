package com.example.safeplaces.service;


import com.example.safeplaces.enumeration.SafetyFeatures;
import com.example.safeplaces.exception.custom.ResourceNotFoundException;
import com.example.safeplaces.model.Review;
import com.example.safeplaces.repository.LocationRepository;
import com.example.safeplaces.repository.ReviewRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final LocationRepository locationRepository;

    public List<Review> getReviewsByLocation(String locationId) {
        return reviewRepository.findByLocationId(locationId);
    }

    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Transactional
    public Review createReview(Review review) {
        if (!locationRepository.existsById(review.getLocationId())) {
            throw new ResourceNotFoundException("Location not found");
        }

        if (review.getSafetyFeatures() != null) {
            review.setSafetyFeatures(
                    review.getSafetyFeatures().stream()
                            .map(Enum::name)
                            .map(s -> SafetyFeatures.valueOf(s.toUpperCase()))
                            .collect(Collectors.toList())
            );
        }
        return reviewRepository.save(review);
    }
}