package com.xrent.car.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarResponse {

    private Long id;
    private String make;
    private String model;
    private int year;
    private String licensePlate;
    private BigDecimal dailyPrice;
    private boolean available;
    private Instant createdAt;
    private Instant updatedAt;
}
