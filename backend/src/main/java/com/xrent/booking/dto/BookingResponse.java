package com.xrent.booking.dto;

import com.xrent.booking.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    // Car details — flattened so the frontend doesn't need a second request
    private Long carId;
    private String carMake;
    private String carModel;
    private String carLicensePlate;

    // User details — useful for admin "all bookings" view
    private Long userId;
    private String userEmail;
    private String userFullName;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private Instant createdAt;
}
