package com.innova.flota.services;

import com.innova.flota.model.Users;
import com.innova.flota.model.Vehicle;
import com.innova.flota.repositories.UsersRepository;
import com.innova.flota.repositories.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UsersRepository usersRepository;

    public Vehicle registerVehicle(Vehicle vehicle) {

        return vehicleRepository.save(vehicle);
    }

    public Vehicle assignDriver(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        vehicle.setDriver(user);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateMileage(Long vehicleId, int newMileage) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (newMileage < vehicle.getKmRecorrido()) {
            throw new IllegalArgumentException("New mileage cannot be less than current mileage");
        }

        vehicle.setKmRecorrido(newMileage);
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> findAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle findVehicleById(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }
}
