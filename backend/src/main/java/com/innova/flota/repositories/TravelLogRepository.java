package com.innova.flota.repositories;

import com.innova.flota.model.TravelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelLogRepository extends JpaRepository<TravelLog, Long> {
    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (arrival_time - created_at)) / 60) FROM travel_log WHERE arrival_time IS NOT NULL AND created_at IS NOT NULL", nativeQuery = true)
    Double findAverageTripDuration();

    /**
     * Obtiene el promedio de duración de viajes por día de la semana para los
     * últimos 7 días.
     * Retorna: día de la semana (1=Dom, 2=Lun, ..., 7=Sáb), nombre del día,
     * promedio en minutos
     */
    @Query(value = """
            SELECT
                EXTRACT(DOW FROM created_at) as day_of_week,
                TO_CHAR(created_at, 'Dy') as day_name,
                ROUND(AVG(EXTRACT(EPOCH FROM (arrival_time - created_at)) / 60)::numeric, 0) as avg_minutes
            FROM travel_log
            WHERE arrival_time IS NOT NULL
                AND created_at IS NOT NULL
                AND created_at >= NOW() - INTERVAL '7 days'
            GROUP BY EXTRACT(DOW FROM created_at), TO_CHAR(created_at, 'Dy')
            ORDER BY EXTRACT(DOW FROM created_at)
            """, nativeQuery = true)
    List<Object[]> findAverageTripDurationByDayOfWeek();
}
