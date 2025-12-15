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

    private Integer year;

    private Double fuelEfficiency;

    private Double batteryHealth;

    private Double engineHealth;

    private Double odometerReading;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "driver_id", referencedColumnName = "id")
    private Users driver;

    public Vehicle(String patente, String marca, String modelo, int kmRecorrido, Integer year, Double fuelEfficiency,
            Double batteryHealth, Double engineHealth, Double odometerReading, Users driver) {
        this.patente = patente;
        this.marca = marca;
        this.modelo = modelo;
        this.kmRecorrido = kmRecorrido;
        this.year = year;
        this.fuelEfficiency = fuelEfficiency;
        this.batteryHealth = batteryHealth;
        this.engineHealth = engineHealth;
        this.odometerReading = odometerReading;
        this.driver = driver;
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", patente='" + patente + '\'' +
                ", marca='" + marca + '\'' +
                ", modelo='" + modelo + '\'' +
                ", year=" + year +
                ", fuelEfficiency=" + fuelEfficiency +
                ", batteryHealth=" + batteryHealth +
                ", engineHealth=" + engineHealth +
                ", odometerReading=" + odometerReading +
                '}';
    }
}
