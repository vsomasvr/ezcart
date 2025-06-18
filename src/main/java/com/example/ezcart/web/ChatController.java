package com.example.ezcart.web;

import com.example.ezcart.domain.ChatMessage;
import com.example.ezcart.service.ChatService;
import com.example.ezcart.web.dto.PostMessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(Authentication authentication) {
        return ResponseEntity.ok(chatService.getChatHistory(authentication.getName()));
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> postMessage(@RequestBody PostMessageRequest messageRequest, Authentication authentication) {
        ChatMessage userMessage = new ChatMessage(
                UUID.randomUUID().toString(),
                messageRequest.text(),
                "user",
                Instant.now()
        );
        ChatMessage aiResponse = chatService.addMessage(authentication.getName(), userMessage);
        return ResponseEntity.ok(aiResponse);
    }
}