package com.example.ezcart.service;

import com.example.ezcart.domain.Product;
import com.example.ezcart.service.dto.ProductListDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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

    private boolean matchesQuery(String query, String text) {
        if (!StringUtils.hasLength(text)) return false;
        
        // Split query into words and convert to lowercase for case-insensitive matching
        String[] queryWords = query.toLowerCase().split("\\s+");
        String lowerText = text.toLowerCase();
        
        // Limit the number of query words to prevent performance issues
        int maxWordsToCheck = Math.min(10, queryWords.length);
        int wordsToCheck = Math.min(queryWords.length, maxWordsToCheck);
        
        // All query words must be found in the text
        for (int i = 0; i < wordsToCheck; i++) {
            String word = queryWords[i].trim();
            if (!word.isEmpty() && !lowerText.matches(".*" + java.util.regex.Pattern.quote(word) + ".*")) {
                return false;
            }
        }
        return wordsToCheck > 0; // Only return true if there were actual words to check
    }
    
    private String getSearchableText(Product product) {
        // Convert specifications to string if they exist
        String specsText = "";
        if (product.specifications() != null) {
            if (product.specifications() instanceof String) {
                specsText = (String) product.specifications();
            } else {
                // Convert the specifications object to a string representation
                specsText = product.specifications().toString();
            }
        }
        
        return String.join(" ",
            product.productName() != null ? product.productName() : "",
            product.shortDescription() != null ? product.shortDescription() : "",
            product.longDescription() != null ? product.longDescription() : "",
            product.features() != null ? String.join(" ", product.features()) : "",
            specsText
        ).toLowerCase();
    }
    
    private boolean matchesCategory(Product product, String category) {
        return product.category() != null && product.category().equalsIgnoreCase(category);
    }
    
    private boolean matchesManufacturer(Product product, String manufacturer) {
        return product.manufacturer() != null && product.manufacturer().equalsIgnoreCase(manufacturer);
    }
    
    private boolean matchesPrice(Product product, Double minPrice, Double maxPrice) {
        return (minPrice == null || product.price() >= minPrice) && 
               (maxPrice == null || product.price() <= maxPrice);
    }
    
    private String getSpecificationValue(Product product, String key) {
        if (product.specifications() == null) {
            return "";
        }
        try {
            // Use reflection to safely access the specification value
            java.lang.reflect.Method getter = product.specifications().getClass().getMethod("get", Object.class);
            Object value = getter.invoke(product.specifications(), key);
            return value != null ? value.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    private boolean matchesRam(Product product, List<String> ramFilters) {
        if (ramFilters == null || ramFilters.isEmpty()) {
            return true;
        }
        String ram = getSpecificationValue(product, "ram");
        return ramFilters.stream()
            .anyMatch(filter -> StringUtils.hasLength(ram) && 
                ram.toLowerCase().contains(filter.toLowerCase()));
    }

    private boolean matchesProcessor(Product product, List<String> processorFilters) {
        if (processorFilters == null || processorFilters.isEmpty()) {
            return true;
        }
        String processor = getSpecificationValue(product, "processor");
        return processorFilters.stream()
            .anyMatch(filter -> StringUtils.hasLength(processor) && 
                processor.toLowerCase().contains(filter.toLowerCase()));
    }

    private boolean matchesStorage(Product product, List<String> storageFilters) {
        if (storageFilters == null || storageFilters.isEmpty()) {
            return true;
        }
        String storage = getSpecificationValue(product, "storage");
        return storageFilters.stream()
            .anyMatch(filter -> StringUtils.hasLength(storage) && 
                storage.toLowerCase().contains(filter.toLowerCase()));
    }

    public List<ProductListDTO> searchProducts(
            String query, 
            String category, 
            Double minPrice, 
            Double maxPrice, 
            String manufacturer,
            List<String> ramFilters,
            List<String> processorFilters,
            List<String> storageFilters) {
        return products.stream()
                .filter(product -> 
                    (!StringUtils.hasLength(category) || matchesCategory(product, category)) &&
                    matchesPrice(product, minPrice, maxPrice) &&
                    (!StringUtils.hasLength(manufacturer) || matchesManufacturer(product, manufacturer)) &&
                    matchesRam(product, ramFilters) &&
                    matchesProcessor(product, processorFilters) &&
                    matchesStorage(product, storageFilters) &&
                    (!StringUtils.hasLength(query) || matchesQuery(query, getSearchableText(product)))
                )
                .map(ProductListDTO::fromProduct)
                .toList();
    }
}
