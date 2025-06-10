package com.example.ezcart.service;

import com.example.ezcart.domain.Review;
import com.example.ezcart.service.dto.ReviewResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private List<Review> reviews;
    private final ObjectMapper objectMapper;

    public ReviewService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() throws IOException {
        try {
            ClassPathResource resource = new ClassPathResource("data/product-reviews.json");
            try (InputStream inputStream = resource.getInputStream()) {
                reviews = objectMapper.readValue(inputStream, new TypeReference<>() {});
            }
        } catch (IOException e) {
            reviews = Collections.emptyList();
            throw new RuntimeException("Failed to load reviews data", e);
        }
    }

    public List<ReviewResponse> getReviewsByProductId(String productId) {
        return reviews.stream()
                .filter(review -> review.productId().equals(productId))
                .map(ReviewResponse::fromReview)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByUserId(String userId) {
        return reviews.stream()
                .filter(review -> review.userId().equals(userId))
                .map(ReviewResponse::fromReview)
                .collect(Collectors.toList());
    }
}
