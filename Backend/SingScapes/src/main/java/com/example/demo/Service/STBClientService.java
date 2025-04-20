package com.example.demo.Service;

import com.example.demo.DTO.STBAttractionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class STBClientService {

    private final String API_URL = "https://api.stb.gov.sg/content/attractions/v2/search";
    private final String API_KEY = "YOUR_API_KEY_HERE";

    public String fetchAttractions(int limit, int page) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", API_KEY);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(API_URL)
            .queryParam("limit", limit)
            .queryParam("page", page);

        ResponseEntity<String> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            entity,
            String.class
        );

        return response.getBody();
    }
}
