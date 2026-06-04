package com.xrent.booking.dto;

import com.xrent.booking.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    // Caller must be within a @Transactional context — user and car are LAZY loaded.
    public BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getCar().getId(),
                booking.getCar().getMake(),
                booking.getCar().getModel(),
                booking.getCar().getLicensePlate(),
                booking.getUser().getId(),
                booking.getUser().getEmail(),
                booking.getUser().getFullName(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
    }
}
