package com.example.demo.Controller;

import com.example.demo.Entity.api.BusStop;
import com.example.demo.Entity.api.HawkerCentre;
import com.example.demo.Service.ExternalDataService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/external")
public class ExternalDataController {

    @Autowired
    private ExternalDataService externalDataService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${lta.datamall.accountkey}")
    private String ltaDataMallAccountKey;

    

    @GetMapping("/hawker-centres")
    public ResponseEntity<List<HawkerCentre>> getHawkers(@RequestParam String postalCode,
                                                         @RequestParam(defaultValue = "500") double radius) {
        return ResponseEntity.ok(externalDataService.getNearbyHawkers(postalCode, radius));
    }
    @GetMapping("/test-bus")
    public ResponseEntity<String> testBusLta() {
        String url = "https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=0";
        HttpHeaders headers = new HttpHeaders();
        headers.set("AccountKey", ltaDataMallAccountKey);
        headers.set("accept", "application/json");

        // Add logging
        System.out.println("Request URL: " + url);
        System.out.println("Request Headers: " + headers);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    @GetMapping("/nearby-healthcare")
    public ResponseEntity<List<Map<String, Object>>> getNearbyHealthcare(@RequestParam String postalCode,
                                                                        @RequestParam(defaultValue = "1000") int radius) {
        return ResponseEntity.ok(externalDataService.getNearbyHealthcare(postalCode, radius, googleMapsApiKey));
    }

    @GetMapping("/nearby-atms")
    public ResponseEntity<List<Map<String, Object>>> getNearbyATMs(@RequestParam String postalCode,
                                                                @RequestParam(defaultValue = "1000") int radius) {
        return ResponseEntity.ok(externalDataService.getNearbyATMs(postalCode, radius, googleMapsApiKey));
    }






}
