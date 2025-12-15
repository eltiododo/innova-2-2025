package com.innova.flota.controllers;

import com.innova.flota.entities.MaintenanceTicket;
import com.innova.flota.entities.Vehicle;
import com.innova.flota.entities.Workshop;
import com.innova.flota.repositories.MaintenanceTicketRepository;
import com.innova.flota.repositories.VehicleRepository;
import com.innova.flota.repositories.WorkshopRepository;
import com.innova.flota.services.MaintenanceService;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;
import java.util.Date;

@Controller
@AllArgsConstructor
public class MaintenanceTicketController {
    private final MaintenanceService maintenanceService;
    private final MaintenanceTicketRepository maintenanceTicketRepository;
    private final VehicleRepository vehicleRepository;
    private final WorkshopRepository workshopRepository;

    record MaintenanceTicketInput(Long vehicleId, Long workshopId, Long fechaMantencion, 
            String status, Integer millaje, String notasExtra) {
    }

    record ScheduledMaintenanceInput(Long qrCodeId, Long workshopId, String date) {}

    @QueryMapping
    Iterable<MaintenanceTicket> maintenanceTickets() {
        return maintenanceTicketRepository.findAll();
    }

    @QueryMapping
    MaintenanceTicket maintenanceTicketById(@Argument Long id) {
        return maintenanceTicketRepository.findById(id).orElse(null);
    }

    @MutationMapping
    MaintenanceTicket scheduleMaintenance(@Argument ScheduledMaintenanceInput scheduledMaintenance) {
        return maintenanceService.scheduleMaintenance(scheduledMaintenance.qrCodeId,
                scheduledMaintenance.workshopId,
                scheduledMaintenance.date);
    }

    @MutationMapping
    MaintenanceTicket addMaintenanceTicket(@Argument MaintenanceTicketInput maintenanceTicket) {
        Vehicle vehicle = vehicleRepository.findById(maintenanceTicket.vehicleId())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el vehículo"));
        
        Workshop workshop = workshopRepository.findById(maintenanceTicket.workshopId())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el taller"));

        MaintenanceTicket ticket = MaintenanceTicket.builder()
                .vehicleID(maintenanceTicket.vehicleId())
                .workshopId(maintenanceTicket.workshopId())
                .fechaMantencion(new Date(maintenanceTicket.fechaMantencion()))
                .status(maintenanceTicket.status())
                .millaje(maintenanceTicket.millaje())
                .notasExtra(maintenanceTicket.notasExtra())
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();

        return maintenanceTicketRepository.save(ticket);
    }
}
