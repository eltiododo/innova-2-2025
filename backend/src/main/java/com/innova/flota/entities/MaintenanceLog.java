package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Maintenance_Log")
public class MaintenanceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private Long vehicleID;

    private Long workshopId;

    private Date fechaMantencion;

    private String status;

    private int millaje;

    private String notasExtra;

    private Timestamp createdAt;

}
