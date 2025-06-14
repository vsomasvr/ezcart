// src/main/java/com/example/ezcart/config/SecurityConfig.java
package com.example.ezcart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HeaderWriterLogoutHandler;
import org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security support and provides the Spring Security integration with the Spring Web MVC.
public class SecurityConfig {

    /**
     * Configures the security filter chain.
     * This method defines security rules for HTTP requests, CORS, CSRF,
     * authentication, and logout behavior.
     *
     * @param http The HttpSecurity object to configure.
     * @return A SecurityFilterChain instance.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure CORS (Cross-Origin Resource Sharing)
                // This allows specified origins to make requests to your API.
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    // Define allowed origins for your frontend applications.
                    config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:8080",
                            "http://localhost:7070", "http://localhost:9090",
                            "http://localhost:5173", "http://localhost:8000"));
                    // Define allowed HTTP methods.
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    // Allow all headers.
                    config.setAllowedHeaders(Collections.singletonList("*"));
                    // Allow credentials (e.g., cookies, HTTP authentication headers).
                    config.setAllowCredentials(true);
                    return config;
                }))
                // Add the custom logging filter before the standard authentication filter.
                .addFilterBefore(new SecurityContextLoggingFilter(), UsernamePasswordAuthenticationFilter.class)
                // Disable CSRF protection. This is common for stateless REST APIs.
                // In a real-world application, you would likely want to configure CSRF protection.
                .csrf(csrf -> csrf.disable())
                // Explicitly configure the SecurityContextRepository to ensure session persistence.
                .securityContext(context -> context
                    .securityContextRepository(new HttpSessionSecurityContextRepository()))
                // Configure session management to create a session if required for authentication.
                .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                // Configure authorization rules for HTTP requests.
                .authorizeHttpRequests(auth -> auth
                        // Allow all requests to paths starting with /api/public/ to be publicly accessible.
                        // This matches paths like /api/public/data, /api/public/status, etc.
                        .requestMatchers("/public/**", "/error").permitAll()
                        // Secure API endpoints that require authentication.
                        .requestMatchers("/api/**").authenticated()
                        // Allow all other requests (e.g., for serving the frontend). This is a fallback.
                        .anyRequest().permitAll()
                )
                // Configure HttpBasic authentication.
                .httpBasic(httpBasic -> httpBasic
                        .authenticationEntryPoint(new HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED)))
                // Configure logout behavior.
                .logout(logout -> logout
                        // Set the logout URL.
                        .logoutUrl("/api/auth/logout")
                        .addLogoutHandler(new HeaderWriterLogoutHandler(new ClearSiteDataHeaderWriter(ClearSiteDataHeaderWriter.Directive.ALL)))
                        // Define a custom logout success handler.
                        .logoutSuccessHandler((request, response, authentication) -> {
                            // Set HTTP status to 200 (OK) on successful logout.
                            response.setStatus(200);
                            // Flush the writer to ensure the response is sent.
                            response.getWriter().flush();
                        })
                        // Invalidate the HttpSession after logout.
                        .invalidateHttpSession(true)
                        // Delete the specified cookies (e.g., JSESSIONID) after logout.
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }

    /**
     * Provides an in-memory user details service for demonstration purposes.
     * In a production application, this would typically be backed by a database.
     *
     * @return An InMemoryUserDetailsManager with predefined users.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        // Define the first demo user.
        UserDetails user1 = User.builder()
                .username("demoUser")
                .password(passwordEncoder().encode("demoPass123")) // Encode the password.
                .roles("USER") // Assign the "USER" role.
                .build();

        // Define the second test user.
        UserDetails user2 = User.builder()
                .username("testUser")
                .password(passwordEncoder().encode("testPass123")) // Encode the password.
                .roles("USER") // Assign the "USER" role.
                .build();

        // Return an InMemoryUserDetailsManager with the defined users.
        return new InMemoryUserDetailsManager(user1, user2);
    }

    /**
     * Provides a BCrypt password encoder.
     * BCrypt is a strong hashing function recommended for storing passwords securely.
     *
     * @return A BCryptPasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
