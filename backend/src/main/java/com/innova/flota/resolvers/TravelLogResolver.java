package com.innova.flota.resolvers;

import com.innova.flota.model.Point;
import com.innova.flota.model.TravelLog;
import com.innova.flota.model.Vehicle;
import com.innova.flota.repositories.TravelLogRepository;
import com.innova.flota.repositories.VehicleRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Controller
public class TravelLogResolver {

    private final TravelLogRepository travelLogRepository;
    private final VehicleRepository vehicleRepository;

    public TravelLogResolver(TravelLogRepository travelLogRepository, VehicleRepository vehicleRepository) {
        this.travelLogRepository = travelLogRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @QueryMapping
    public List<TravelLog> travelLogs() {
        return travelLogRepository.findAll();
    }

    @QueryMapping
    public TravelLog travelLogById(@Argument Long id) {
        return travelLogRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public TravelLog addTravelLog(@Argument TravelLogInput travelLog) {
        TravelLog log = new TravelLog();
        log.setVehicleId(travelLog.vehicleId());
        log.setStartPosition(formatPoint(travelLog.startLatitude(), travelLog.startLongitude()));
        if (travelLog.endLatitude() != null && travelLog.endLongitude() != null) {
            log.setEndPosition(formatPoint(travelLog.endLatitude(), travelLog.endLongitude()));
        } else {
            log.setEndPosition(formatPoint(travelLog.startLatitude(), travelLog.startLongitude()));
        }
        log.setAvgSpeed(travelLog.avgSpeed());
        log.setAvgAcceleration(travelLog.avgAcceleration());
        log.setState(travelLog.state());
        log.setCreatedAt(LocalDateTime.now());
        return travelLogRepository.save(log);
    }

    @SchemaMapping(typeName = "TravelLog", field = "vehicle")
    public Vehicle vehicle(TravelLog log) {
        return vehicleRepository.findById(log.getVehicleId()).orElse(null);
    }

    @SchemaMapping(typeName = "TravelLog", field = "startPosition")
    public Point startPosition(TravelLog log) {
        return parsePoint(log.getStartPosition());
    }

    @SchemaMapping(typeName = "TravelLog", field = "endPosition")
    public Point endPosition(TravelLog log) {
        return parsePoint(log.getEndPosition());
    }

    private static String formatPoint(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return null;
        }
        return String.format(Locale.US, "(%f, %f)", latitude, longitude);
    }

    private static Point parsePoint(String raw) {
        if (raw == null || raw.isBlank()) {
            return new Point(0.0, 0.0);
        }
        String trimmed = raw.trim();
        if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
            trimmed = trimmed.substring(1, trimmed.length() - 1);
        }
        String[] parts = trimmed.split(",");
        if (parts.length != 2) {
            return new Point(0.0, 0.0);
        }
        try {
            Double x = Double.parseDouble(parts[0].trim());
            Double y = Double.parseDouble(parts[1].trim());
            return new Point(x, y);
        } catch (NumberFormatException ex) {
            return new Point(0.0, 0.0);
        }
    }

    public record TravelLogInput(
            Long vehicleId,
            Double startLatitude,
            Double startLongitude,
            Double endLatitude,
            Double endLongitude,
            Float avgSpeed,
            Float avgAcceleration,
            String state
    ) {
    }
}
