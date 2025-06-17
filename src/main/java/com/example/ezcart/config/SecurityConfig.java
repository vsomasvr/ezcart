package com.example.ezcart.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Arrays;
import java.util.Collections;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security support and provides the Spring Security integration with the Spring Web MVC.
public class SecurityConfig {

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Value("${okta.post-logout-redirect-uri}")
    private String postLogoutRedirectUri;

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
                            "http://localhost:5173", "http://localhost:8000", "https://localhost:7443"));
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
//                .requiresChannel(channel -> channel.anyRequest().requiresSecure())
                // Disable CSRF protection. This is common for stateless REST APIs.
                // In a real-world application, you would likely want to configure CSRF protection.
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                // Configure authorization rules for HTTP requests.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/*.ico", "/*.json", "/*.png", "/public/**", "/error").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        // By default, Spring Security redirects to the last intercepted URL after login.
                        // For an SPA, this can be an incorrect asset like a CSS file.
                        // This line forces a redirect to the root, ensuring the main application page loads correctly.
                        .defaultSuccessUrl("/", true) // Always redirect to the root after login
                )
                .logout(logout -> logout
                        .logoutSuccessHandler(oidcLogoutSuccessHandler())
                        // oauth2Login() is stateful and uses an HttpSession to store the OAuth2AuthenticationToken.
                        // These steps are essential to invalidate the local session and clear security context.
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }

    OidcClientInitiatedLogoutSuccessHandler oidcLogoutSuccessHandler() {
        OidcClientInitiatedLogoutSuccessHandler successHandler = new OidcClientInitiatedLogoutSuccessHandler(clientRegistrationRepository);
        successHandler.setPostLogoutRedirectUri(postLogoutRedirectUri);
        return successHandler;
    }
}
