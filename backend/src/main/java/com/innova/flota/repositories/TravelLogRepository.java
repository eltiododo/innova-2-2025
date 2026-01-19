package com.innova.flota.repositories;

import com.innova.flota.model.TravelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelLogRepository extends JpaRepository<TravelLog, Long> {
    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (arrival_time - created_at)) / 60) FROM travel_log WHERE arrival_time IS NOT NULL AND created_at IS NOT NULL", nativeQuery = true)
    Double findAverageTripDuration();
}
