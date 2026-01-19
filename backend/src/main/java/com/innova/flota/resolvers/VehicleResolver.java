package com.innova.flota.resolvers;

import com.innova.flota.model.Vehicle;
import com.innova.flota.repositories.VehicleRepository;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
public class VehicleResolver {

    private final VehicleRepository vehicleRepository;

    public VehicleResolver(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @QueryMapping
    public List<Vehicle> vehicles() {
        return vehicleRepository.findAll();
    }

    @QueryMapping
    public Vehicle vehicle(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }
}
