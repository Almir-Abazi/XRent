package com.xrent.booking;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    // Counts active bookings for a car whose date range overlaps [startDate, endDate).
    // Cancelled bookings are excluded — they free up the slot.
    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.car.id = :carId
              AND b.status <> com.xrent.booking.BookingStatus.CANCELLED
              AND b.startDate < :endDate
              AND b.endDate > :startDate
            """)
    long countOverlappingBookings(@Param("carId") Long carId,
                                  @Param("startDate") LocalDate startDate,
                                  @Param("endDate") LocalDate endDate);
}
