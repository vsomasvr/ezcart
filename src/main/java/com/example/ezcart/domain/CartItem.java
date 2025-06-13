package com.example.ezcart.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CartItem(
    String productId,
    int quantity
) {
    // Empty constructor for JSON deserialization
    public CartItem {
    }
}
