package com.example.ezcart.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.TokenExchangeOAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.endpoint.*;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    @Value("${okta.ezcart-ai.audience}")
    private String ezcartAiAudience;

    @Bean
    public OAuth2AuthorizedClientProvider tokenExchange() {

        // 1. Create the RestClientTokenExchangeTokenResponseClient
        // This client internally uses DefaultOAuth2TokenRequestParametersConverter
        // to handle standard token exchange parameters.
        RestClientTokenExchangeTokenResponseClient tokenResponseClient =
                new RestClientTokenExchangeTokenResponseClient();

        // 2. Customize the tokenResponseClient to add the 'audience' parameter
        // The parametersCustomizer is called AFTER the default parameters are added.
        tokenResponseClient.setParametersCustomizer(parameters -> {
            parameters.add(OAuth2ParameterNames.AUDIENCE, ezcartAiAudience);
        });

        // 3. Create the TokenExchangeOAuth2AuthorizedClientProvider
        // This provider uses the tokenResponseClient to get the access token.
        TokenExchangeOAuth2AuthorizedClientProvider provider =
                new TokenExchangeOAuth2AuthorizedClientProvider();
        provider.setAccessTokenResponseClient(tokenResponseClient);

        return provider;
    }

    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientRepository authorizedClientRepository) {

        OAuth2AuthorizedClientProvider authorizedClientProvider =
                OAuth2AuthorizedClientProviderBuilder.builder()
                        .authorizationCode()
                        .refreshToken()
                        .clientCredentials()
                        .provider(tokenExchange())
                        .build();

        DefaultOAuth2AuthorizedClientManager authorizedClientManager = new DefaultOAuth2AuthorizedClientManager(
                clientRegistrationRepository, authorizedClientRepository);
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }

    @Bean
    WebClient webClient() {
        return WebClient.builder()
                .baseUrl(aiServiceBaseUrl)
                .build();
    }
}