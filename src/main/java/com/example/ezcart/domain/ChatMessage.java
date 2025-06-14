package com.example.ezcart.domain;

import java.time.Instant;

/**
 * Represents a single chat message in the system.
 * This is an immutable record, making it inherently thread-safe.
 *
 * @param id The unique identifier for the message.
 * @param text The content of the message.
 * @param sender The originator of the message ('user' or 'ai').
 * @param timestamp The exact time the message was created.
 */
public record ChatMessage(
    String id,
    String text,
    String sender,
    Instant timestamp
) {}
