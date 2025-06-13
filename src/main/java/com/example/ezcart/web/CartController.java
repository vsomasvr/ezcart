package com.example.ezcart.web;

import com.example.ezcart.domain.CartItem;
import com.example.ezcart.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Principal principal) {
        String userId = getUserId(principal);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<List<CartItem>> addToCart(
            @RequestBody CartItem item,
            Principal principal) {
        String userId = getUserId(principal);
        return ResponseEntity.ok(cartService.addToCart(userId, item));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<List<CartItem>> updateCartItem(
            @PathVariable String productId,
            @RequestParam int quantity,
            Principal principal) {
        String userId = getUserId(principal);
        return ResponseEntity.ok(cartService.updateCartItem(userId, productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable String productId,
            Principal principal) {
        String userId = getUserId(principal);
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Principal principal) {
        String userId = getUserId(principal);
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<List<CartItem>> mergeCarts(
            @RequestBody List<CartItem> localCartItems,
            Principal principal) {
        String userId = getUserId(principal);
        return ResponseEntity.ok(cartService.mergeCarts(userId, localCartItems));
    }

    private String getUserId(Principal principal) {
        if (principal == null) {
            throw new IllegalStateException("User must be authenticated to access cart");
        }
        return principal.getName();
    }
}
