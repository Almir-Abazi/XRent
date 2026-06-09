package com.xrent.booking;

import com.xrent.booking.dto.BookingRequest;
import com.xrent.booking.dto.BookingResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(@AuthenticationPrincipal UserDetails userDetails,
                                         @Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(userDetails.getUsername(), request);
    }

    @GetMapping("/me")
    public Page<BookingResponse> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return bookingService.getUserBookings(userDetails.getUsername(), pageable);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<BookingResponse> getAllBookings(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return bookingService.getAllBookings(pageable);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelBooking(@PathVariable Long id,
                              @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        bookingService.cancelBooking(id, userDetails.getUsername(), isAdmin);
    }
}
