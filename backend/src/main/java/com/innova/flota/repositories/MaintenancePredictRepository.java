package com.innova.flota.repositories;

import com.innova.flota.entities.MaintenancePredict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenancePredictRepository extends JpaRepository<MaintenancePredict, Long> {}
