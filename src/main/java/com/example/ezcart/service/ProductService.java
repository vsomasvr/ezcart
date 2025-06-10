package com.example.ezcart.service;

import com.example.ezcart.domain.Product;
import com.example.ezcart.service.dto.ProductListDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private List<Product> products;
    private final ObjectMapper objectMapper;

    public ProductService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() throws IOException {
        try {
            ClassPathResource resource = new ClassPathResource("data/products.json");
            try (InputStream inputStream = resource.getInputStream()) {
                products = objectMapper.readValue(inputStream, new TypeReference<>() {});
            }
        } catch (IOException e) {
            // Log error and initialize with empty list
            products = Collections.emptyList();
            throw new RuntimeException("Failed to load products data", e);
        }
    }

    public List<ProductListDTO> getAllProducts() {
        return products.stream()
                .map(ProductListDTO::fromProduct)
                .toList();
    }

    public Optional<Product> getProductById(String id) {
        return products.stream()
                .filter(p -> p.productId().equals(id))
                .findFirst();
    }

    public List<ProductListDTO> getProductsByCategory(String category) {
        return products.stream()
                .filter(p -> p.category().equalsIgnoreCase(category))
                .map(ProductListDTO::fromProduct)
                .toList();
    }
}
