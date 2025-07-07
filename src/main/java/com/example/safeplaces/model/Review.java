package com.example.safeplaces.model;

import com.example.safeplaces.enumeration.SafetyFeatures;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
@CompoundIndex(def = "{'userId':1, 'locationId':1}")
public class Review {
    @Id
    private String id;

    @NotBlank(message = "Location ID is required")
    private String locationId;

    @NotBlank(message = "User ID is required")
    private String userId;

    @Size(max = 50, message = "User name cannot exceed 50 characters")
    private String userName;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;

    @CreatedDate
    private LocalDateTime createdAt;

    @Size(max = 10, message = "Cannot specify more than 10 safety features")
    @Enumerated(EnumType.STRING)
    private List<SafetyFeatures> safetyFeatures;
}