package com.example.ezcart.web.dto;

/**
 * A Data Transfer Object for receiving new chat message submissions.
 * This ensures that we only accept the fields we need from the client.
 *
 * @param text The text content of the user's message.
 */
public record PostMessageRequest(String text) {}
