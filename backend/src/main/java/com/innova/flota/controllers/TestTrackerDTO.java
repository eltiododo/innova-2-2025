package com.innova.flota.controllers;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestTrackerDTO {
    private Double lat;
    private Double lng;
    private Long vehicleId;
}
