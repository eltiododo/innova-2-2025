package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;

import java.sql.Timestamp;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Table_Log")
public class TravelLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private Long vehicleId;

    Point startPosition;

    Point endPosition;

    Float avgSpeed;

    Timestamp timestamp;

    Timestamp createdAt;
}
