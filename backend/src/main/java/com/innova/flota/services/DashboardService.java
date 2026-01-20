package com.innova.flota.services;

import com.innova.flota.repositories.VehicleRepository;
import com.innova.flota.repositories.TravelLogRepository;
import com.innova.flota.repositories.MaintenanceTicketRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final TravelLogRepository travelLogRepository;
    private final MaintenanceTicketRepository maintenanceTicketRepository;

    public DashboardService(VehicleRepository vehicleRepository,
            TravelLogRepository travelLogRepository,
            MaintenanceTicketRepository maintenanceTicketRepository) {
        this.vehicleRepository = vehicleRepository;
        this.travelLogRepository = travelLogRepository;
        this.maintenanceTicketRepository = maintenanceTicketRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // stats basicos
        stats.put("totalVehicles", vehicleRepository.count());
        stats.put("avgFuelEfficiency", roundToTwo(vehicleRepository.findAverageFuelEfficiency()));
        stats.put("avgTripTime",
                Math.round(travelLogRepository.findAverageTripDuration() != null
                        ? travelLogRepository.findAverageTripDuration()
                        : 0));
        stats.put("vehiclesInMaintenance", vehicleRepository.countVehiclesNeedingMaintenance());

        // datos para grafos historicos
        stats.put("fuelEfficiencyLast6Months", getFuelEfficiencyLast6Months());
        stats.put("avgTripTimeLastWeek", getAvgTripTimeLastWeek());
        stats.put("maintenanceLast4Weeks", getMaintenanceLast4Weeks());

        return stats;
    }

    private List<Map<String, Object>> getFuelEfficiencyLast6Months() {
        // harcodeo datos de los ultimos 6 meses basados en la eficiencia actual para
        // probar
        Double avgEfficiency = vehicleRepository.findAverageFuelEfficiency();
        if (avgEfficiency == null)
            avgEfficiency = 25.0;

        List<Map<String, Object>> data = new ArrayList<>();
        String[] months = { "Ene", "Feb", "Mar", "Abr", "May", "Jun" };
        Random random = new Random(42);

        for (String month : months) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", month);
            // variacion del 10% sobre el promedio
            double variation = avgEfficiency * (0.9 + random.nextDouble() * 0.2);
            point.put("value", roundToTwo(variation));
            data.add(point);
        }

        return data;
    }

    private List<Map<String, Object>> getAvgTripTimeLastWeek() {
        List<Object[]> rawData = travelLogRepository.findAverageTripDurationByDayOfWeek();

        // Mapeo de día PostgreSQL (0=Dom, 1=Lun, ..., 6=Sáb) a nombres en español
        String[] dayNames = { "Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb" };

        // Crear mapa con todos los días inicializados en 0
        Map<Integer, Long> dayValues = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            dayValues.put(i, 0L);
        }

        // Rellenar con datos reales
        for (Object[] row : rawData) {
            if (row[0] != null && row[2] != null) {
                int dayOfWeek = ((Number) row[0]).intValue();
                long avgMinutes = ((Number) row[2]).longValue();
                dayValues.put(dayOfWeek, avgMinutes);
            }
        }

        // Construir la lista ordenada empezando por Lunes
        List<Map<String, Object>> data = new ArrayList<>();
        int[] orderedDays = { 1, 2, 3, 4, 5, 6, 0 }; // Lun, Mar, Mié, Jue, Vie, Sáb, Dom

        for (int dayIndex : orderedDays) {
            Map<String, Object> point = new HashMap<>();
            point.put("day", dayNames[dayIndex]);
            point.put("value", dayValues.get(dayIndex));
            data.add(point);
        }

        return data;
    }

    private List<Map<String, Object>> getMaintenanceLast4Weeks() {
        long totalInMaintenance = vehicleRepository.countVehiclesNeedingMaintenance();

        List<Map<String, Object>> data = new ArrayList<>();
        String[] weeks = { "Sem 1", "Sem 2", "Sem 3", "Sem 4" };
        Random random = new Random(44);

        for (int i = 0; i < weeks.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("week", weeks[i]);
            // tendencia creciente hacia la semana actual
            long value = (long) (totalInMaintenance * (0.5 + (i * 0.15) + random.nextDouble() * 0.2));
            point.put("value", value);
            data.add(point);
        }

        return data;
    }

    private Double roundToTwo(Double value) {
        if (value == null)
            return 0.0;
        return Math.round(value * 100.0) / 100.0;
    }
}
