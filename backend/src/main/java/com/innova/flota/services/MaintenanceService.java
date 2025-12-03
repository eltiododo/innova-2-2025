package com.innova.flota.services;

import com.innova.flota.entities.MaintenanceLog;
import com.innova.flota.entities.Vehicle;
import com.innova.flota.repositories.MaintenanceLogRepository;
import com.innova.flota.repositories.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
@AllArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceLog scheduleMaintenance(MaintenanceLog log) {
        // Ensure vehicle exists
        if (!vehicleRepository.existsById(log.getVehicleID())) {
            throw new RuntimeException("Vehicle not found for ID: " + log.getVehicleID());
        }

        log.setStatus("PENDING");
        log.setCreatedAt(Timestamp.from(Instant.now()));
        return maintenanceLogRepository.save(log);
    }

    public MaintenanceLog completeMaintenance(Long maintenanceId, String notes, Integer finalMileage) {
        MaintenanceLog log = maintenanceLogRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance Log not found"));

        log.setStatus("COMPLETED");
        if (notes != null) {
            log.setNotasExtra(notes);
        }

        // Update vehicle mileage if provided
        if (finalMileage != null) {
            Vehicle vehicle = vehicleRepository.findById(log.getVehicleID())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));

            if (finalMileage >= vehicle.getKmRecorrido()) {
                vehicle.setKmRecorrido(finalMileage);
                vehicleRepository.save(vehicle);
            }
            log.setMillaje(finalMileage);
        }

        return maintenanceLogRepository.save(log);
    }

    public List<MaintenanceLog> getMaintenanceHistory(Long vehicleId) {
        // This assumes we might need a custom query in repository if not available,
        // but for now let's see if we can filter or if we need to add a method to repo.
        // Since I can't easily change repo interface without checking it first,
        // I'll assume for now we might need to fetch all or use an example matcher,
        // BUT standard JPA repos usually don't have findByVehicleID unless defined.
        // Let's check the repo content again or just add the method to the repo if
        // needed.
        // For this step, I will assume the repo needs the method.
        // Wait, I can't edit the repo in this same step safely if I'm not sure.
        // I'll leave this method commented or simple for now and fix repo in next step.
        return maintenanceLogRepository.findAll().stream()
                .filter(log -> log.getVehicleID().equals(vehicleId))
                .toList();
    }
}
