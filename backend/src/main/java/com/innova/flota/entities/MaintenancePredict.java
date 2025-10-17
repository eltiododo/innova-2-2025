package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name="MaintenancePredict")
public class MaintenancePredict {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "car-id", referencedColumnName = "id")
    private Vehicle vehicle;

    private Date predicted;

    private Float confidenceScore;
}
