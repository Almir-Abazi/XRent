package com.xrent.car;

import com.xrent.car.dto.CarRequest;
import com.xrent.car.dto.CarResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    // Public — no auth required (SecurityConfig permits GET /api/cars/**)
    @GetMapping
    public Page<CarResponse> getAllCars(
            @RequestParam(required = false) Boolean available,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return carService.getAllCars(available, pageable);
    }

    @GetMapping("/{id}")
    public CarResponse getCarById(@PathVariable Long id) {
        return carService.getCarById(id);
    }

    // ADMIN only
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public CarResponse createCar(@Valid @RequestBody CarRequest request) {
        return carService.createCar(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CarResponse updateCar(@PathVariable Long id, @Valid @RequestBody CarRequest request) {
        return carService.updateCar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
    }
}
