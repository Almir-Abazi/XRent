package com.xrent.car.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarRequest {

    @NotBlank(message = "Make is required")
    @Size(max = 100, message = "Make must not exceed 100 characters")
    private String make;

    @NotBlank(message = "Model is required")
    @Size(max = 100, message = "Model must not exceed 100 characters")
    private String model;

    @Min(value = 1886, message = "Year must be 1886 or later")
    @Max(value = 2100, message = "Year must be 2100 or earlier")
    private int year;

    @NotBlank(message = "License plate is required")
    @Size(max = 20, message = "License plate must not exceed 20 characters")
    private String licensePlate;

    @NotNull(message = "Daily price is required")
    @Positive(message = "Daily price must be greater than 0")
    private BigDecimal dailyPrice;

    // Defaults to true so newly created cars are available unless explicitly set otherwise.
    private boolean available = true;
}
