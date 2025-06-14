package com.example.ezcart.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class SecurityContextLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(SecurityContextLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        if (authentication != null) {
            logger.info("Security Context for path: {}", request.getRequestURI());
            logger.info("  Principal: {}", authentication.getPrincipal());
            logger.info("  Authorities: {}", authentication.getAuthorities());
            logger.info("  Is Authenticated: {}", authentication.isAuthenticated());
        } else {
            logger.info("Security Context for path: {}. No authentication object found.", request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }
}
