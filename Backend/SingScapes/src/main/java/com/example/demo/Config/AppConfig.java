package com.example.demo.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    // Define a RestTemplate bean so that Spring Boot can inject it
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
