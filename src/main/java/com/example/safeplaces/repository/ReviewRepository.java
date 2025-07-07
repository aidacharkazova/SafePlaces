package com.example.safeplaces.repository;


import com.example.safeplaces.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByLocationId(String locationId);
    List<Review> findByUserId(String userId);
}
