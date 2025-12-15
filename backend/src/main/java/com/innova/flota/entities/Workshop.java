package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Workshop")
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String name;

    private String direction;

    @jakarta.persistence.Convert(converter = PointAttributeConverter.class)
    @Column(name = "location", columnDefinition = "point")
    Point location;

}
