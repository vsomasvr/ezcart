package com.example.ezcart.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public record Review(
    @JsonProperty("reviewId") String reviewId,
    @JsonProperty("productId") String productId,
    @JsonProperty("userId") String userId,
    @JsonProperty("rating") int rating,
    @JsonProperty("title") String title,
    @JsonProperty("comment") String comment,
    @JsonProperty("date") @JsonFormat(pattern = "yyyy-MM-dd") LocalDate date
) {}
