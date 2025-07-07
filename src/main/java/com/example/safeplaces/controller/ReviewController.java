package com.example.safeplaces.controller;


import com.example.safeplaces.model.Review;
import com.example.safeplaces.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

   @GetMapping("/userId/{userId}")
   public ResponseEntity<List<Review>> getReviewByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
   }

    @GetMapping("/locationId/{locationId}")
    public ResponseEntity<List<Review>> getReviewByLocationId(@PathVariable String locationId) {
        return ResponseEntity.ok(reviewService.getReviewsByLocation(locationId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody @Valid Review review) {
        Review createdReview = reviewService.createReview(review);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdReview.getId())
                .toUri();
        return ResponseEntity.created(location).body(createdReview);
    }


}
