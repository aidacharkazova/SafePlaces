package com.example.safeplaces.model;


import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Location {
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "^(cafe|park|library|restaurant|mall|other)$",
            message = "Type must be one of: cafe, park, library, restaurant, mall, other")
    private String type;


    private List<@Size(max = 50, message = "Each amenity name cannot exceed 50 characters") String> amenities;

    @DecimalMin(value = "0.0", message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5")
    private Double averageRating = 0.0;

    @Min(value = 0, message = "Review count cannot be negative")
    private Integer reviewCount = 0;

}
