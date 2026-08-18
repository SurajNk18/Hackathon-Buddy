package com.hackathonbuddy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Registers a RestTemplate bean with sensible timeouts for the Python ML service client.
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);  // 5s connection timeout
        factory.setReadTimeout(30_000);    // 30s read timeout (ML inference can be slow)
        return new RestTemplate(factory);
    }
}
