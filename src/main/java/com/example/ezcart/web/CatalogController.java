package com.example.ezcart.web;

import com.example.ezcart.domain.Product;
import com.example.ezcart.service.dto.ProductListDTO;
import com.example.ezcart.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final ProductService productService;

    public CatalogController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public List<ProductListDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products/category/{category}")
    public List<ProductListDTO> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping(value = "/search")
    public List<ProductListDTO> searchProducts(
            @RequestParam(name = "query", required = false) String query,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "minPrice", required = false) Double minPrice,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice,
            @RequestParam(name = "manufacturer", required = false) String manufacturer,
            @RequestParam(name = "spec.ram", required = false) List<String> ramFilters,
            @RequestParam(name = "spec.processor", required = false) List<String> processorFilters,
            @RequestParam(name = "spec.storage", required = false) List<String> storageFilters) {
        return productService.searchProducts(
                query,
                category,
                minPrice,
                maxPrice,
                manufacturer,
                ramFilters,
                processorFilters,
                storageFilters
        );
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<String> handleNoSuchElementException(NoSuchElementException ex) {
        return ResponseEntity.notFound().build();
    }
}
