package com.innova.flota.controllers;

import com.innova.flota.entities.TravelLog;
import com.innova.flota.entities.Vehicle;
import com.innova.flota.repositories.TravelLogRepository;
import com.innova.flota.repositories.TravelLogJdbcRepository;
import com.innova.flota.repositories.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;

@Controller
@AllArgsConstructor
public class TravelLogController {
    private final TravelLogRepository travelLogRepository;
    private final VehicleRepository vehicleRepository;
    private final TravelLogJdbcRepository travelLogJdbcRepository;

    record TravelLogInput(Long vehicleId, Double startLatitude, Double startLongitude, 
            Double endLatitude, Double endLongitude, Float avgSpeed, Float avgAcceleration, String state) {
    }

    @QueryMapping
    Iterable<TravelLog> travelLogs() {
        return travelLogRepository.findAll();
    }

    @QueryMapping
    TravelLog travelLogById(@Argument Long id) {
        return travelLogRepository.findById(id).orElse(null);
    }

    @MutationMapping
    TravelLog addTravelLog(@Argument TravelLogInput travelLog) {
        Vehicle vehicle = vehicleRepository.findById(travelLog.vehicleId())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el vehículo"));

        Point startPosition = new Point(travelLog.startLatitude(), travelLog.startLongitude());
        Point endPosition = new Point(travelLog.endLatitude(), travelLog.endLongitude());

        TravelLog log = TravelLog.builder()
                .vehicle(vehicle)
                .startPosition(startPosition)
                .endPosition(endPosition)
                .avgSpeed(travelLog.avgSpeed())
                .avgAcceleration(travelLog.avgAcceleration())
                .state(travelLog.state())
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();

        // Use JDBC-backed repository to ensure Postgres point parameters are bound correctly
        return travelLogJdbcRepository.save(log);
    }
}
