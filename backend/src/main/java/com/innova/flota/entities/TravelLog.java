package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;

import java.sql.Timestamp;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "travel_log")
public class TravelLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    private Vehicle vehicle;

    @Column(name = "start_position", columnDefinition = "point")
    @Convert(converter = PointAttributeConverter.class)
    private Point startPosition;

    @Column(name = "end_position", columnDefinition = "point")
    @Convert(converter = PointAttributeConverter.class)
    private Point endPosition;

    private Float avgSpeed;

    private Float avgAcceleration;

    private String state;

    private Timestamp arrivalTime;

    private Timestamp createdAt;
}
