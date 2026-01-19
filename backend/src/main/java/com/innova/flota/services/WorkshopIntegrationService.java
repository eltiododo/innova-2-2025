package com.innova.flota.services;

import com.innova.flota.model.Vehicle;
import com.innova.flota.repositories.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class WorkshopIntegrationService {
    private VehicleRepository vehicleRepository;

    public Vehicle getVehicle(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }
}
