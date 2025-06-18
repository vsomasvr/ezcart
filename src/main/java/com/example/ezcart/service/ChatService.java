package com.example.ezcart.service;

import com.example.ezcart.domain.ChatMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.*;
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
    private static final Logger log = LoggerFactory.getLogger(ChatService.class);
    private final Map<String, List<ChatMessage>> chatHistories = new ConcurrentHashMap<>();
    private final WebClient webClient;
    private final OAuth2AuthorizedClientManager authorizedClientManager;
    private final OAuth2AuthorizedClientRepository authorizedClientRepository;

    @Autowired
    public ChatService(WebClient webClient, OAuth2AuthorizedClientManager authorizedClientManager, OAuth2AuthorizedClientRepository authorizedClientRepository) {
        this.webClient = webClient;
        this.authorizedClientManager = authorizedClientManager;
        this.authorizedClientRepository = authorizedClientRepository;
    }

    public List<ChatMessage> getChatHistory(String userId) {
        return chatHistories.getOrDefault(userId, Collections.emptyList());
    }

    public ChatMessage addMessage(String userId, ChatMessage userMessage) {
        // Use CopyOnWriteArrayList for thread-safe list modifications.
        // This is efficient when reads are more frequent than writes.
        chatHistories.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(userMessage);

        // This is the core logic for the manual token exchange
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (!(requestAttributes instanceof ServletRequestAttributes)) {
            throw new IllegalStateException("Current request is not a servlet request.");
        }
        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
        Authentication authentication = (Authentication) request.getUserPrincipal();

        // 1. Load the authorized client from the HTTP session
        OAuth2AuthorizedClient initialAuthorizedClient = this.authorizedClientRepository.loadAuthorizedClient(
                "ezcart-web", authentication, request);

        if (initialAuthorizedClient == null) {
            throw new IllegalStateException("Could not find authorized client for 'ezcart-web'. User may not be logged in.");
        }

        // 2. Create the special principal with the subject token
        OAuth2AccessToken subjectToken = initialAuthorizedClient.getAccessToken();
        Authentication principalWithToken = new UsernamePasswordAuthenticationToken(subjectToken, null, authentication.getAuthorities());

        // 3. Build the request for the token exchange
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                .withClientRegistrationId("ezcart-backend")
                .principal(principalWithToken)
                .build();

        // 4. Perform the token exchange
        OAuth2AuthorizedClient exchangedClient = this.authorizedClientManager.authorize(authorizeRequest);
        if (exchangedClient == null) {
            throw new IllegalStateException("Token exchange failed. Could not authorize the 'ezcart-backend' client.");
        }
        String exchangedTokenValue = exchangedClient.getAccessToken().getTokenValue();

        // 5. Make the final call with the manual Authorization header
        ChatMessage aiResponseText = webClient.post()
                .uri("/api/ai/execute")
                .headers(headers -> headers.setBearerAuth(exchangedTokenValue))
                .bodyValue(userMessage.text())
                .retrieve()
                .bodyToMono(ChatMessage.class)
                .block();

        ChatMessage aiMessage = new ChatMessage(
                java.util.UUID.randomUUID().toString(),
                Objects.requireNonNull(aiResponseText).text(),
                "ai",
                Instant.now()
        );
        chatHistories.get(userId).add(aiMessage);
        return aiMessage;
    }
}