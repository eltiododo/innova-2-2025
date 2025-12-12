package com.innova.flota.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

@Service
public class PredictionService {

    @Value("${ml.api.url:http://localhost:8000/predict}")
    private String mlApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean predictMaintenance(Map<String, Object> vehicleData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(vehicleData, headers);

            Map<String, Object> response = restTemplate.postForObject(mlApiUrl, request, Map.class);

            if (response != null && response.containsKey("needs_maintenance")) {
                Object result = response.get("needs_maintenance");
                if (result instanceof Boolean) {
                    return (Boolean) result;
                }
                if (result instanceof Integer) {
                    return ((Integer) result) == 1;
                }
            }

        } catch (Exception e) {
            System.err.println("Error calling ML service: " + e.getMessage());
        }
        return false;
    }
}
