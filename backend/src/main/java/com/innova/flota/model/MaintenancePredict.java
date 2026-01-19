package com.innova.flota.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_predict")
public class MaintenancePredict {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "car-id", unique = true)
    private Long carId;
    
    @Column(name = "confidence_score")
    private Float confidenceScore;
    
    private LocalDateTime predicted;

    public MaintenancePredict() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    
    public Float getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Float confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public LocalDateTime getPredicted() { return predicted; }
    public void setPredicted(LocalDateTime predicted) { this.predicted = predicted; }
}
