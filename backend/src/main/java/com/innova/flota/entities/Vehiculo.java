package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Vehiculo")
public class Vehiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String patente;

    private String marca;

    private String modelo;

    private int kmRecorrido;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "driver-id", referencedColumnName = "id")
    private Usuarios driver;
}
