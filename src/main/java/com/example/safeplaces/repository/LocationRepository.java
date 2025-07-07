package com.example.safeplaces.repository;


import com.example.safeplaces.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocationRepository extends MongoRepository<Location,String> {
       List<Location> findByType(String type);
       List<Location> findByTypeAndAverageRatingGreaterThanEqual(String type,double minRating);
       List<Location> findByAverageRatingGreaterThanEqual(double minRating);
       List<Location> findByNameContainingOrAddressContaining(String nameQuery,String addressQuery);
       boolean existsByNameAndAddress(String nameQuery,String addressQuery);

       List<Location> findByTypeAndAddressContainingAndAverageRatingGreaterThanEqual(
               String type, String address, Double averageRating);

}
