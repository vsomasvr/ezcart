package com.example.ezcart.service;

import com.example.ezcart.domain.ChatMessage;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class ChatService {

    // --- Concurrency Strategy: Concurrent Collections ---
    // This service uses concurrent collections from java.util.concurrent to ensure thread safety,
    // avoiding the need for explicit locks like ReentrantReadWriteLock.
    // 1. `ConcurrentHashMap`: Provides thread-safe access to the map of user chat histories.
    // 2. `CopyOnWriteArrayList`: Used for each user's message list. It's highly efficient
    //    for append-heavy workloads where reads are frequent. Every write operation creates a
    //    new copy of the list, making read operations lock-free and very fast.
    // This modern approach is less verbose and well-suited for the simpler, append-style
    // operations of a chat system.
    private final Map<String, List<ChatMessage>> chatHistories = new ConcurrentHashMap<>();

    /**
     * Retrieves the chat history for a specific user.
     *
     * @param userId The ID of the user whose chat history is being requested.
     * @return A list of chat messages, or an empty list if none exists.
     */
    public List<ChatMessage> getChatHistory(String userId) {
        return chatHistories.getOrDefault(userId, Collections.emptyList());
    }

    /**
     * Adds a user's message to their history and generates a placeholder AI response.
     *
     * @param userId The ID of the user sending the message.
     * @param userMessage The message sent by the user.
     * @return The generated AI response message.
     */
    public ChatMessage addMessage(String userId, ChatMessage userMessage) {
        // Use CopyOnWriteArrayList for thread-safe list modifications.
        // This is efficient when reads are more frequent than writes.
        chatHistories.putIfAbsent(userId, new CopyOnWriteArrayList<>());

        List<ChatMessage> userChatHistory = chatHistories.get(userId);
        userChatHistory.add(userMessage);

        // Simulate an AI response and add it to the history.
        ChatMessage aiResponse = new ChatMessage(
            UUID.randomUUID().toString(),
            "Thanks for your message! I'm a placeholder AI and I'm processing your request.",
            "ai",
            Instant.now()
        );
        userChatHistory.add(aiResponse);

        return aiResponse;
    }
}
