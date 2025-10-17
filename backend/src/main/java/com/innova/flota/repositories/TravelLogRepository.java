package com.innova.flota.repositories;

import com.innova.flota.entities.TravelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelLogRepository extends JpaRepository<TravelLog, Long> {
}
