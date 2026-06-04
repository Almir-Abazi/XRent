package com.xrent.car.dto;

import com.xrent.car.Car;
import org.springframework.stereotype.Component;

@Component
public class CarMapper {

    public CarResponse toResponse(Car car) {
        return new CarResponse(
                car.getId(),
                car.getMake(),
                car.getModel(),
                car.getYear(),
                car.getLicensePlate(),
                car.getDailyPrice(),
                car.isAvailable(),
                car.getCreatedAt(),
                car.getUpdatedAt()
        );
    }

    public Car toEntity(CarRequest request) {
        Car car = new Car();
        applyRequest(car, request);
        return car;
    }

    public void updateEntity(Car car, CarRequest request) {
        applyRequest(car, request);
    }

    private void applyRequest(Car car, CarRequest request) {
        car.setMake(request.getMake());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setLicensePlate(request.getLicensePlate());
        car.setDailyPrice(request.getDailyPrice());
        car.setAvailable(request.isAvailable());
    }
}
