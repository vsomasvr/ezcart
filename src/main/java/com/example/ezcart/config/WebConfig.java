package com.example.ezcart.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public ObjectMapper objectMapper() {
        return Jackson2ObjectMapperBuilder.json()
                .modules(new JavaTimeModule())
                .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
    }

    /**
     * Configures resource handling to support a Single Page Application (SPA).
     * This setup ensures that any deep links or refresh attempts on frontend routes
     * are correctly forwarded to the main index.html file, allowing the client-side
     * router (e.g., React Router) to manage the application's navigation.
     *
     * @param registry The registry for resource handlers.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve all static assets from the "classpath:/static/" directory.
        // This includes JavaScript, CSS, images, etc.
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                // Add a custom resolver to handle SPA routing.
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        // If the requested resource is a file that exists (like main.js or an image), serve it.
                        // Otherwise, it's a frontend route, so serve index.html to let the React router take over.
                        return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
                                : new ClassPathResource("/static/index.html");
                    }
                });
    }
}
