package com.example.ezcart.service.dto;

import com.example.ezcart.domain.Product;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductListDTO(
    String productId,
    String productName,
    String manufacturer,
    String category,
    double price,
    String currency,
    String thumbnailUrl,
    String fullImageUrl,
    String shortDescription,
    Object specifications,
    String[] features,
    String[] availableColors
) {
    public static ProductListDTO fromProduct(Product product) {
        return new ProductListDTO(
            product.productId(),
            product.productName(),
            product.manufacturer(),
            product.category(),
            product.price(),
            product.currency(),
            product.thumbnailUrl(),
            product.fullImageUrl(),
            product.shortDescription(),
            product.specifications(),
            product.features(),
            product.availableColors()
        );
    }
}
