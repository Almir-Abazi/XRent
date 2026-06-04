package com.xrent.car;

import com.xrent.car.dto.CarMapper;
import com.xrent.car.dto.CarRequest;
import com.xrent.car.dto.CarResponse;
import com.xrent.common.exception.ConflictException;
import com.xrent.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final CarMapper carMapper;

    @Transactional(readOnly = true)
    public Page<CarResponse> getAllCars(Boolean available, Pageable pageable) {
        if (available != null) {
            return carRepository.findByAvailable(available, pageable).map(carMapper::toResponse);
        }
        return carRepository.findAll(pageable).map(carMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public CarResponse getCarById(Long id) {
        return carRepository.findById(id)
                .map(carMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
    }

    @Transactional
    public CarResponse createCar(CarRequest request) {
        if (carRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new ConflictException("License plate already registered: " + request.getLicensePlate());
        }
        return carMapper.toResponse(carRepository.save(carMapper.toEntity(request)));
    }

    @Transactional
    public CarResponse updateCar(Long id, CarRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        if (carRepository.existsByLicensePlateAndIdNot(request.getLicensePlate(), id)) {
            throw new ConflictException("License plate already registered: " + request.getLicensePlate());
        }

        carMapper.updateEntity(car, request);
        return carMapper.toResponse(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new ResourceNotFoundException("Car not found with id: " + id);
        }
        carRepository.deleteById(id);
    }
}
