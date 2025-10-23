package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String patente;

    private String marca;

    private String modelo;

    private int kmRecorrido;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "driver_id", referencedColumnName = "id")
    private Users driver;

    public Vehicle(String patente, String marca, String modelo, int kmRecorrido, Users driver) {
        this.patente = patente;
        this.marca = marca;
        this.modelo = modelo;
        this.kmRecorrido = kmRecorrido;
        this.driver = driver;
    }
}
