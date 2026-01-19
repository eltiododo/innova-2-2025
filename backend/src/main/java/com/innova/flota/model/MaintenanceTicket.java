package com.innova.flota.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_ticket")
public class MaintenanceTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicleid")
    private Long vehicleId;
    
    private String description;
    private String status;
    
    @Column(name = "notas_extra")
    private String notasExtra;
    
    private Integer millaje;
    
    @Column(name = "fecha_mantencion")
    private LocalDateTime fechaMantencion;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "workshop_id")
    private Long workshopId;

    // constructor
    public MaintenanceTicket() {}

    // getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getNotasExtra() { return notasExtra; }
    public void setNotasExtra(String notasExtra) { this.notasExtra = notasExtra; }
    
    public Integer getMillaje() { return millaje; }
    public void setMillaje(Integer millaje) { this.millaje = millaje; }
    
    public LocalDateTime getFechaMantencion() { return fechaMantencion; }
    public void setFechaMantencion(LocalDateTime fechaMantencion) { this.fechaMantencion = fechaMantencion; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getWorkshopId() { return workshopId; }
    public void setWorkshopId(Long workshopId) { this.workshopId = workshopId; }
}
