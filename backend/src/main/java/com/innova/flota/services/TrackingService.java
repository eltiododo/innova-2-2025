package com.innova.flota.services;

import com.innova.flota.entities.TravelLog;
import com.innova.flota.entities.Vehicle;
import com.innova.flota.repositories.TravelLogRepository;
import com.innova.flota.repositories.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;

@Service
@AllArgsConstructor
public class TrackingService {
    private TravelLogRepository travelLogRepository;
    private VehicleRepository vehicleRepository;

    public Long beginTracking(Long vehicleId, Point startPos) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);

        if (vehicle == null) {
            return (long) -1;
        }

        TravelLog travelLog = TravelLog.builder()
                .vehicle(vehicle)
                .startPosition(startPos)
                .createdAt(Timestamp.from(Instant.now()))
                .build();

        return travelLogRepository.save(travelLog).getId();
    }

    public Long endTracking(Long trackingId, Point endPos) {
        TravelLog travelLog = travelLogRepository.findById(trackingId).orElse(null);

        if (travelLog == null) {
            return (long) -1;
        }

        travelLog.setEndPosition(endPos);
        travelLog.setArrivalTime(Timestamp.from(Instant.now()));
        return travelLogRepository.save(travelLog).getId();
    }
}
