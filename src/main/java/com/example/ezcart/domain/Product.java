package com.example.ezcart.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Product(
    String productId,
    String productName,
    String manufacturer,
    String category,
    double price,
    String currency,
    String thumbnailUrl,
    String fullImageUrl,
    String shortDescription,
    String longDescription,
    Object specifications,
    String[] features,
    String[] availableColors
) {
    // Empty constructor for JSON deserialization
    public Product {
    }
}
