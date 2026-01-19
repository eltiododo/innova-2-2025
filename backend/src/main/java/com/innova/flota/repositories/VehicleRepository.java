package com.innova.flota.repositories;

import com.innova.flota.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("SELECT AVG(v.fuelEfficiency) FROM Vehicle v WHERE v.fuelEfficiency IS NOT NULL")
    Double findAverageFuelEfficiency();

    @Query("SELECT AVG(v.batteryHealth) FROM Vehicle v WHERE v.batteryHealth IS NOT NULL")
    Double findAverageBatteryHealth();

    @Query("SELECT AVG(v.engineHealth) FROM Vehicle v WHERE v.engineHealth IS NOT NULL")
    Double findAverageEngineHealth();

    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.batteryHealth < 70 OR v.engineHealth < 70")
    long countVehiclesNeedingMaintenance();

    @Query("SELECT SUM(v.kmRecorrido) FROM Vehicle v")
    Long sumTotalKilometers();

    @Query("SELECT COUNT(v) FROM Vehicle v WHERE ((v.batteryHealth + v.engineHealth) / 2) BETWEEN :minHealth AND :maxHealth")
    long countByHealthRange(@Param("minHealth") int minHealth, @Param("maxHealth") int maxHealth);
}
