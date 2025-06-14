package com.example.ezcart.service;

import com.example.ezcart.domain.CartItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Service
public class CartService {

    // In-memory storage: userId -> List of cart items
    private final Map<String, List<CartItem>> userCarts = new ConcurrentHashMap<>();

    // --- Concurrency Strategy: ReentrantReadWriteLock ---
    // A ReentrantReadWriteLock is used to ensure thread safety for cart operations.
    // This strategy is chosen because cart modifications (e.g., adding an item) are
    // complex "read-modify-write" operations that must be atomic.
    // For example, adding an item requires first checking if it exists, then either
    // updating its quantity or adding a new item. An explicit write lock ensures
    // this entire sequence is performed without interruption from other threads.
    // Read operations (like getting the cart) can happen concurrently.
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    public List<CartItem> getCart(String userId) {
        lock.readLock().lock();
        try {
            return new ArrayList<>(userCarts.getOrDefault(userId, new ArrayList<>()));
        } finally {
            lock.readLock().unlock();
        }
    }

    public List<CartItem> addToCart(String userId, CartItem item) {
        lock.writeLock().lock();
        try {
            List<CartItem> cart = userCarts.computeIfAbsent(userId, k -> new ArrayList<>());
            
            // Check if item already exists in cart
            int existingIndex = -1;
            for (int i = 0; i < cart.size(); i++) {
                if (cart.get(i).productId().equals(item.productId())) {
                    existingIndex = i;
                    break;
                }
            }
            
            if (existingIndex >= 0) {
                // Update quantity if item exists
                CartItem existing = cart.get(existingIndex);
                cart.set(existingIndex, new CartItem(
                    existing.productId(),
                    existing.quantity() + item.quantity()
                ));
            } else {
                // Add new item
                cart.add(item);
            }
            
            return new ArrayList<>(cart);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public List<CartItem> updateCartItem(String userId, String productId, int quantity) {
        lock.writeLock().lock();
        try {
            List<CartItem> cart = userCarts.get(userId);
            if (cart == null) {
                throw new IllegalArgumentException("Cart not found");
            }

            for (int i = 0; i < cart.size(); i++) {
                if (cart.get(i).productId().equals(productId)) {
                    cart.set(i, new CartItem(productId, quantity));
                    break;
                }
            }

            return new ArrayList<>(cart);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public void removeFromCart(String userId, String productId) {
        lock.writeLock().lock();
        try {
            List<CartItem> cart = userCarts.get(userId);
            if (cart != null) {
                cart.removeIf(item -> item.productId().equals(productId));
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    public void clearCart(String userId) {
        lock.writeLock().lock();
        try {
            userCarts.remove(userId);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public List<CartItem> mergeCarts(String userId, List<CartItem> localCart) {
        lock.writeLock().lock();
        try {
            List<CartItem> serverCart = userCarts.computeIfAbsent(userId, k -> new ArrayList<>());
            
            // Create a map of productId to quantity for faster lookup
            Map<String, Integer> serverItems = new java.util.HashMap<>();
            for (CartItem item : serverCart) {
                serverItems.put(item.productId(), item.quantity());
            }

            // Merge local cart items
            for (CartItem localItem : localCart) {
                serverItems.merge(
                    localItem.productId(),
                    localItem.quantity(),
                    Integer::sum
                );
            }

            // Update server cart with merged items
            List<CartItem> mergedCart = new ArrayList<>();
            serverItems.forEach((productId, quantity) -> 
                mergedCart.add(new CartItem(productId, quantity))
            );

            // Update the server cart
            userCarts.put(userId, mergedCart);
            return new ArrayList<>(mergedCart);
        } finally {
            lock.writeLock().unlock();
        }
    }
}
