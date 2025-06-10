package com.example.ezcart.service.dto;

import com.example.ezcart.domain.Review;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record ReviewResponse(
    String reviewId,
    String userId,
    int rating,
    String title,
    String comment,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate date
) {
    public static ReviewResponse fromReview(Review review) {
        return new ReviewResponse(
            review.reviewId(),
            review.userId(),
            review.rating(),
            review.title(),
            review.comment(),
            review.date()
        );
    }
}
