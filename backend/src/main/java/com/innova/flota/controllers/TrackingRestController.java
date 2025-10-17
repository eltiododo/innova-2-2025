package com.innova.flota.controllers;

import com.innova.flota.repositories.TravelLogRepository;
import com.innova.flota.services.TrackingService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// ############# REST controller de prueba =) falta hacerlo en graphqls
@RestController
@RequestMapping("/api/tracking")
public class TrackingRestController {

    @Autowired
    private TrackingService trackingService;

    @PostMapping("/begin")
    public ResponseEntity<?> beginTracking(@RequestBody TestTrackerDTO testTrackerDTO) {
        Point startPos = new Point(testTrackerDTO.getLat(), testTrackerDTO.getLng());
        Long result = trackingService.beginTracking(testTrackerDTO.getVehicleId(), startPos);

        if (result > 0) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.badRequest().build();
    }

}
