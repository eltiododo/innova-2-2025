package com.innova.flota.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_log")
public class TravelLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "vehicle_id")
    private Long vehicleId;
    
    @Column(name = "start_position")
    private String startPosition;
    
    @Column(name = "end_position")
    private String endPosition;
    
    @Column(name = "avg_speed")
    private Float avgSpeed;
    
    @Column(name = "avg_acceleration")
    private Float avgAcceleration;
    
    private String state;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    public TravelLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    
    public String getStartPosition() { return startPosition; }
    public void setStartPosition(String startPosition) { this.startPosition = startPosition; }
    
    public String getEndPosition() { return endPosition; }
    public void setEndPosition(String endPosition) { this.endPosition = endPosition; }
    
    public Float getAvgSpeed() { return avgSpeed; }
    public void setAvgSpeed(Float avgSpeed) { this.avgSpeed = avgSpeed; }
    
    public Float getAvgAcceleration() { return avgAcceleration; }
    public void setAvgAcceleration(Float avgAcceleration) { this.avgAcceleration = avgAcceleration; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
}
