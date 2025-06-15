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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security support and provides the Spring Security integration with the Spring Web MVC.
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${app.security.users:user:password:USER}")
    private String users;

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
                // Enforce HTTPS for all requests.
                // In a production environment with a reverse proxy (e.g., Nginx, AWS ELB)
                // handling SSL termination, this might be configured differently.
                .requiresChannel(channel -> channel.anyRequest().requiresSecure())
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
     * @param passwordEncoder The PasswordEncoder to encode the user's password.
     * @return A UserDetailsService containing the demo user.
     */
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        log.info("Loading users from properties...");
        List<UserDetails> userDetailsList = new ArrayList<>();

        // Split the users string by semicolon to get individual user definitions.
        String[] userDefinitions = users.split(";");

        for (String userDefinition : userDefinitions) {
            // Split each definition by colon to get username, password, and roles.
            String[] parts = userDefinition.split(":", 3);
            if (parts.length == 3) {
                String username = parts[0].trim();
                String password = parts[1].trim();
                String[] roles = parts[2].trim().split(",");

                if (username.isEmpty() || password.isEmpty()) {
                    log.warn("Skipping user with empty username or password: {}", userDefinition);
                    continue;
                }

                UserDetails user = User.builder()
                        .username(username)
                        .password(passwordEncoder.encode(password))
                        .roles(roles)
                        .build();
                userDetailsList.add(user);
                log.info("Loaded user '{}' with roles {}", username, Arrays.toString(roles));
            } else {
                log.warn("Skipping malformed user entry: {}", userDefinition);
            }
        }

        if (userDetailsList.isEmpty()) {
            log.error("No valid users were loaded from properties. Please check the 'app.security.users' configuration.");
            // Return a manager with no users, effectively locking the system.
            return new InMemoryUserDetailsManager();
        }

        return new InMemoryUserDetailsManager(userDetailsList);
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
