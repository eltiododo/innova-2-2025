package com.innova.flota.controllers;

import com.innova.flota.entities.Vehicle;
import com.innova.flota.entities.Users;
import com.innova.flota.repositories.UsersRepository;
import com.innova.flota.repositories.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class VehicleController {
    private final VehicleRepository vehicleRepository;
    private final UsersRepository usersRepository;
    record VehicleInput(String patente, String marca, String modelo, int kmRecorrido, Long driverId) {}

    @QueryMapping
    Iterable<Vehicle> vehicles(){
        return vehicleRepository.findAll();
    }

    @QueryMapping
    Vehicle vehicleById(@Argument Long id){
        return vehicleRepository.findById(id).orElse(null);
    }

    @MutationMapping
    Vehicle addVehicle(@Argument VehicleInput vehicle) {
        Users user = usersRepository.findById(vehicle.driverId()).orElseThrow(() -> new IllegalArgumentException("No se encontro el conductor"));
        Vehicle v = new Vehicle(vehicle.patente, vehicle.marca, vehicle.modelo, vehicle.kmRecorrido, user);
        return vehicleRepository.save(v);
    }
}
