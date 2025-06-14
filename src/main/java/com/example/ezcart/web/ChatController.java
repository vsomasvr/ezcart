package com.example.ezcart.web;

import com.example.ezcart.domain.ChatMessage;
import com.example.ezcart.service.ChatService;
import com.example.ezcart.web.dto.PostMessageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * GET /api/chat/history : Get the chat history for the authenticated user.
     */
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(Principal principal) {
        String userId = getUserId(principal);
        return ResponseEntity.ok(chatService.getChatHistory(userId));
    }

    /**
     * POST /api/chat/messages : Post a new message and get an AI response.
     */
    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> postMessage(@RequestBody PostMessageRequest request, Principal principal) {
        String userId = getUserId(principal);

        // Create the full user message object on the server to ensure data integrity.
        ChatMessage userMessage = new ChatMessage(
            UUID.randomUUID().toString(),
            request.text(),
            "user",
            Instant.now()
        );

        // The service adds the user message and returns the AI's response.
        ChatMessage aiResponse = chatService.addMessage(userId, userMessage);
        return ResponseEntity.ok(aiResponse);
    }

    private String getUserId(Principal principal) {
        if (principal == null) {
            throw new IllegalStateException("User must be authenticated to use chat features.");
        }
        return principal.getName();
    }
}
