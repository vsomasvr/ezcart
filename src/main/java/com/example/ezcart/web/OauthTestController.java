package com.example.ezcart.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OauthTestController {
    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private OAuth2AuthorizedClientManager authorizedClientManager;

    @GetMapping("/api/chat/get-access-token")
    public String getAccessToken(OAuth2AuthenticationToken authentication) {
        if (authentication != null) {
            OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                    authentication.getAuthorizedClientRegistrationId(),
                    authentication.getName()
            );
            if (client != null) {
//                OAuth2AccessToken accessToken = client.getAccessToken();

                // 2. Create the special principal with the subject token
                OAuth2AccessToken subjectToken = client.getAccessToken();
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

                return "Access Token: " + exchangedTokenValue;
            }
        }
        return "No access token found.";
    }
}
