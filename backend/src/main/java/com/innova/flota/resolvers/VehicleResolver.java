package com.innova.flota.resolvers;

import com.innova.flota.model.Users;
import com.innova.flota.model.Vehicle;
import com.innova.flota.repositories.VehicleRepository;
import com.innova.flota.repositories.UsersRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
public class VehicleResolver {

    private final VehicleRepository vehicleRepository;
    private final UsersRepository usersRepository;

    public VehicleResolver(VehicleRepository vehicleRepository, UsersRepository usersRepository) {
        this.vehicleRepository = vehicleRepository;
        this.usersRepository = usersRepository;
    }

    @QueryMapping
    public List<Vehicle> vehicles() {
        return vehicleRepository.findAll();
    }

    @QueryMapping
    public Vehicle vehicleById(@Argument Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Vehicle addVehicle(@Argument VehicleInput vehicle) {
        Users driver = usersRepository.findById(vehicle.driverId())
                .orElseThrow(() -> new IllegalArgumentException("No se encontro el conductor"));
        Vehicle newVehicle = new Vehicle();
        newVehicle.setPatente(vehicle.patente());
        newVehicle.setMarca(vehicle.marca());
        newVehicle.setModelo(vehicle.modelo());
        newVehicle.setKmRecorrido(vehicle.kmRecorrido());
        newVehicle.setYear(vehicle.year());
        newVehicle.setFuelEfficiency(vehicle.fuelEfficiency());
        newVehicle.setBatteryHealth(vehicle.batteryHealth());
        newVehicle.setEngineHealth(vehicle.engineHealth());
        newVehicle.setOdometerReading(vehicle.odometerReading());
        newVehicle.setDriver(driver);
        return vehicleRepository.save(newVehicle);
    }

    public record VehicleInput(
            String patente,
            String marca,
            String modelo,
            int kmRecorrido,
            Integer year,
            Double fuelEfficiency,
            Double batteryHealth,
            Double engineHealth,
            Double odometerReading,
            Long driverId
    ) {
    }
}
