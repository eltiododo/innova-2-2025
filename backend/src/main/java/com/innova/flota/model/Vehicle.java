package com.innova.flota.model;

import jakarta.persistence.*;

@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patente;
    private String marca;
    private String modelo;
    private int kmRecorrido;
    private Integer year;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Users driver;

    private Double fuelEfficiency;
    private Double batteryHealth;
    private Double engineHealth;
    private Double odometerReading;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.OPERATIONAL;

    // constructor
    public Vehicle() {
    }

    public Vehicle(Long id, String patente, String marca, String modelo, int kmRecorrido, Integer year,
            Users driver, Double fuelEfficiency, Double batteryHealth, Double engineHealth, Double odometerReading) {
        this.id = id;
        this.patente = patente;
        this.marca = marca;
        this.modelo = modelo;
        this.kmRecorrido = kmRecorrido;
        this.year = year;
        this.driver = driver;
        this.fuelEfficiency = fuelEfficiency;
        this.batteryHealth = batteryHealth;
        this.engineHealth = engineHealth;
        this.odometerReading = odometerReading;
    }

    // getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatente() {
        return patente;
    }

    public void setPatente(String patente) {
        this.patente = patente;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public int getKmRecorrido() {
        return kmRecorrido;
    }

    public void setKmRecorrido(int kmRecorrido) {
        this.kmRecorrido = kmRecorrido;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Users getDriver() {
        return driver;
    }

    public void setDriver(Users driver) {
        this.driver = driver;
    }

    public Double getFuelEfficiency() {
        return fuelEfficiency;
    }

    public void setFuelEfficiency(Double fuelEfficiency) {
        this.fuelEfficiency = fuelEfficiency;
    }

    public Double getBatteryHealth() {
        return batteryHealth;
    }

    public void setBatteryHealth(Double batteryHealth) {
        this.batteryHealth = batteryHealth;
    }

    public Double getEngineHealth() {
        return engineHealth;
    }

    public void setEngineHealth(Double engineHealth) {
        this.engineHealth = engineHealth;
    }

    public Double getOdometerReading() {
        return odometerReading;
    }

    public void setOdometerReading(Double odometerReading) {
        this.odometerReading = odometerReading;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }
}