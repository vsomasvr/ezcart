package com.example.ezcart.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * A simple REST controller for demonstration purposes.
 * It includes public and protected endpoints to test Spring Security configuration.
 */
@RestController
@RequestMapping("/api") // Base path for all endpoints in this controller
public class DemoController {

    /**
     * Public endpoint. Accessible without authentication.
     * This should be reachable via /api/public/test
     */
    @GetMapping("/public/test")
    public String publicEndpoint() {
        return "This is a public endpoint message! You accessed it without authentication.";
    }

    /**
     * Protected endpoint. Requires authentication (e.g., HTTP Basic).
     * This should be reachable via /api/protected/data
     */
    @GetMapping("/protected/data")
    public String protectedEndpoint() {
        return "This is a protected endpoint message! You are authenticated.";
    }

    /**
     * Another protected endpoint.
     * This should be reachable via /api/protected/hello
     */
    @GetMapping("/protected/hello")
    public String protectedHello() {
        return "Hello, you are authenticated!";
    }
}
