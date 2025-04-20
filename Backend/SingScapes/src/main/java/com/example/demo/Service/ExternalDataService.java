package com.example.demo.Service;

import com.example.demo.Entity.api.BusStop;
import com.example.demo.Entity.api.HawkerCentre;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ExternalDataService {

    @Value("${LTADATAMALL_ACCOUNTKEY}")
    private String accountKey;

    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<BusStop> getNearbyBusStops(String postalCode, double radiusMeters) {
        double[] coords = getCoordinatesFromPostalCode(postalCode);
        double lat = coords[0], lon = coords[1];

        List<BusStop> result = new ArrayList<>();
        int skip = 0;

        while (true) {
            String url = "https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=" + skip;
            HttpHeaders headers = new HttpHeaders();
            headers.set("AccountKey", accountKey);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            List<BusStop> stops = parseBusStops(response.getBody());

            if (stops.isEmpty()) break;

            for (BusStop stop : stops) {
                if (calculateDistance(lat, lon, stop.getLatitude(), stop.getLongitude()) <= radiusMeters)
                    result.add(stop);
            }
            skip += 500;
        }
        return result;
    }

    public List<HawkerCentre> getNearbyHawkers(String postalCode, double radiusMeters) {
        double[] coords = getCoordinatesFromPostalCode(postalCode);
        double lat = coords[0], lon = coords[1];

        String url = "https://data.gov.sg/api/action/datastore_search?resource_id=d_68a42f09f350881996d83f9cd73ab02f&limit=10000";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        List<HawkerCentre> hawkers = parseHawkers(response.getBody());

        List<HawkerCentre> result = new ArrayList<>();
        for (HawkerCentre h : hawkers) {
            String postal = extractPostal(h.getLocationOfCentre());
            if (postal != null) {
                double[] loc = getCoordinatesFromPostalCode(postal);
                h.setLatitude(loc[0]);
                h.setLongitude(loc[1]);
                if (calculateDistance(lat, lon, loc[0], loc[1]) <= radiusMeters)
                    result.add(h);
            }
        }
        return result;
    }

    private double[] getCoordinatesFromPostalCode(String postal) {
        try {
            String url = "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=" + postal + "&returnGeom=Y&getAddrDetails=N";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode node = objectMapper.readTree(response.getBody()).path("results").get(0);
            return new double[]{
                node.path("LATITUDE").asDouble(),
                node.path("LONGITUDE").asDouble()
            };
        } catch (Exception e) {
            return new double[]{0, 0};
        }
    }

    private List<BusStop> parseBusStops(String json) {
        List<BusStop> list = new ArrayList<>();
        try {
            JsonNode nodes = objectMapper.readTree(json).path("value");
            for (JsonNode n : nodes) {
                BusStop stop = new BusStop();
                stop.setBusStopCode(n.path("BusStopCode").asText());
                stop.setRoadName(n.path("RoadName").asText());
                stop.setDescription(n.path("Description").asText());
                stop.setLatitude(n.path("Latitude").asDouble());
                stop.setLongitude(n.path("Longitude").asDouble());
                list.add(stop);
            }
        } catch (Exception ignored) {}
        return list;
    }

    private List<HawkerCentre> parseHawkers(String json) {
        List<HawkerCentre> list = new ArrayList<>();
        try {
            JsonNode nodes = objectMapper.readTree(json).path("result").path("records");
            for (JsonNode n : nodes) {
                HawkerCentre h = new HawkerCentre();
                h.setNameOfCentre(n.path("name_of_centre").asText());
                h.setLocationOfCentre(n.path("location_of_centre").asText());
                h.setTypeOfCentre(n.path("type_of_centre").asText());
                h.setOwner(n.path("owner").asText());
                h.setNoOfStalls(n.path("no_of_stalls").asInt());
                h.setNoOfCookedFoodStalls(n.path("no_of_cooked_food_stalls").asInt());
                h.setNoOfMktProduceStalls(n.path("no_of_mkt_produce_stalls").asInt());
                list.add(h);
            }
        } catch (Exception ignored) {}
        return list;
    }

    private String extractPostal(String location) {
        try {
            int start = location.indexOf("S(") + 2;
            int end = location.indexOf(")", start);
            return location.substring(start, end).split("/")[0];
        } catch (Exception e) {
            return null;
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1), dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000;
    }

    public List<Map<String, Object>> getNearbyHealthcare(String postalCode, int radius, String googleApiKey) {
        List<Map<String, Object>> healthcareList = new ArrayList<>();
    
        try {
            // Step 1: Convert postal code to lat/lng using OneMap
            String geoUrl = "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=" + postalCode + "&returnGeom=Y&getAddrDetails=N";
            ResponseEntity<String> geoResponse = restTemplate.getForEntity(geoUrl, String.class);
            JsonNode geoRoot = objectMapper.readTree(geoResponse.getBody());
            JsonNode geoResult = geoRoot.path("results").get(0);
            String lat = geoResult.path("LATITUDE").asText();
            String lng = geoResult.path("LONGITUDE").asText();
    
            // Step 2: Call Google Places Nearby API
            String type = "hospital|doctor|health";
            String googleUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
                    lat + "," + lng + "&radius=" + radius + "&type=" + type + "&key=" + googleApiKey;
            ResponseEntity<String> placesResponse = restTemplate.getForEntity(googleUrl, String.class);
            JsonNode places = objectMapper.readTree(placesResponse.getBody()).path("results");
    
            // Step 3: Extract relevant fields
            for (JsonNode place : places) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("name", place.path("name").asText());
                entry.put("vicinity", place.path("vicinity").asText());
                entry.put("rating", place.has("rating") ? place.path("rating").asDouble() : "N/A");
                entry.put("types", objectMapper.convertValue(place.path("types"), List.class));
                entry.put("lat", place.path("geometry").path("location").path("lat").asDouble());
                entry.put("lng", place.path("geometry").path("location").path("lng").asDouble());
                healthcareList.add(entry);
            }
    
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch healthcare info");
            healthcareList.add(error);
        }
    
        return healthcareList;
    }

    public List<Map<String, Object>> getNearbyATMs(String postalCode, int radius, String googleApiKey) {
        List<Map<String, Object>> atmList = new ArrayList<>();
    
        try {
            // Step 1: Convert postal code to lat/lng using OneMap
            String geoUrl = "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=" + postalCode + "&returnGeom=Y&getAddrDetails=N";
            ResponseEntity<String> geoResponse = restTemplate.getForEntity(geoUrl, String.class);
            JsonNode geoRoot = objectMapper.readTree(geoResponse.getBody());
            JsonNode geoResult = geoRoot.path("results").get(0);
            String lat = geoResult.path("LATITUDE").asText();
            String lng = geoResult.path("LONGITUDE").asText();
    
            // Step 2: Call Google Places Nearby API for ATMs
            String type = "atm";
            String googleUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
                    lat + "," + lng + "&radius=" + radius + "&type=" + type + "&key=" + googleApiKey;
    
            ResponseEntity<String> placesResponse = restTemplate.getForEntity(googleUrl, String.class);
            JsonNode places = objectMapper.readTree(placesResponse.getBody()).path("results");
    
            // Step 3: Extract relevant fields
            for (JsonNode place : places) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("name", place.path("name").asText());
                entry.put("vicinity", place.path("vicinity").asText());
                entry.put("rating", place.has("rating") ? place.path("rating").asDouble() : "N/A");
                entry.put("types", objectMapper.convertValue(place.path("types"), List.class));
                entry.put("lat", place.path("geometry").path("location").path("lat").asDouble());
                entry.put("lng", place.path("geometry").path("location").path("lng").asDouble());
                atmList.add(entry);
            }
    
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch ATM info");
            atmList.add(error);
        }
    
        return atmList;
    }



    
    
}
