package com.example.safeplaces.service;


import com.example.safeplaces.exception.custom.DuplicateResourceException;
import com.example.safeplaces.exception.custom.ResourceNotFoundException;
import com.example.safeplaces.model.Location;
import com.example.safeplaces.model.Review;
import com.example.safeplaces.repository.LocationRepository;
import com.example.safeplaces.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final ReviewRepository reviewRepository;

    public Location getByLocationId(String id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        List<Review> reviews = reviewRepository.findByLocationId(id);

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        int reviewCount = reviews.size();

        location.setAverageRating(averageRating);
        location.setReviewCount(reviewCount);

        return location;
    }

    public Location createLocation(Location location) {

        if (locationRepository.existsByNameAndAddress(location.getName(), location.getAddress())) {
            throw new DuplicateResourceException("Location with this name and address already exists");
        }
        return locationRepository.save(location);
    }

    public List<Location> searchLocation(String type, Double minRating, String address) {
        List<Location> locations = locationRepository.findAll(); // get all

        return locations.stream()
                .peek(loc -> {
                    List<Review> reviews = reviewRepository.findByLocationId(loc.getId());
                    double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
                    loc.setAverageRating(avg);
                    loc.setReviewCount(reviews.size());
                })
                .filter(loc -> type == null || loc.getType().equalsIgnoreCase(type))
                .filter(loc -> minRating == null || loc.getAverageRating() >= minRating) // moved after average is set
                .filter(loc -> address == null || loc.getAddress().toLowerCase().contains(address.toLowerCase()))
                .collect(Collectors.toList());
    }



}

