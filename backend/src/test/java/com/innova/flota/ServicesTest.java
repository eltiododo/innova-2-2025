package com.innova.flota;

import com.innova.flota.entities.MaintenanceLog;
import com.innova.flota.entities.Users;
import com.innova.flota.entities.Vehicle;
import com.innova.flota.repositories.MaintenanceLogRepository;
import com.innova.flota.repositories.UsersRepository;
import com.innova.flota.repositories.VehicleRepository;
import com.innova.flota.services.MaintenanceService;
import com.innova.flota.services.UserService;
import com.innova.flota.services.VehicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ServicesTest {

    @Mock
    private UsersRepository usersRepository;
    @Mock
    private VehicleRepository vehicleRepository;
    @Mock
    private MaintenanceLogRepository maintenanceLogRepository;

    @InjectMocks
    private UserService userService;
    @InjectMocks
    private VehicleService vehicleService;
    @InjectMocks
    private MaintenanceService maintenanceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser() {
        Users user = new Users();
        user.setUsername("testuser");
        when(usersRepository.save(any(Users.class))).thenReturn(user);

        Users created = userService.createUser(user);
        assertNotNull(created);
        assertEquals("testuser", created.getUsername());
    }

    @Test
    void testRegisterVehicle() {
        Vehicle vehicle = new Vehicle();
        vehicle.setPatente("ABCD-12");
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        Vehicle registered = vehicleService.registerVehicle(vehicle);
        assertNotNull(registered);
        assertEquals("ABCD-12", registered.getPatente());
    }

    @Test
    void testAssignDriver() {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        Users user = new Users();
        user.setId(1L);

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(usersRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        Vehicle updated = vehicleService.assignDriver(1L, 1L);
        assertNotNull(updated.getDriver());
        assertEquals(user, updated.getDriver());
    }

    @Test
    void testScheduleMaintenance() {
        MaintenanceLog log = new MaintenanceLog();
        log.setVehicleID(1L);

        when(vehicleRepository.existsById(1L)).thenReturn(true);
        when(maintenanceLogRepository.save(any(MaintenanceLog.class))).thenReturn(log);

        MaintenanceLog scheduled = maintenanceService.scheduleMaintenance(log);
        assertEquals("PENDING", scheduled.getStatus());
        assertNotNull(scheduled.getCreatedAt());
    }

    @Test
    void testCompleteMaintenance() {
        MaintenanceLog log = new MaintenanceLog();
        log.setId(1L);
        log.setVehicleID(1L);
        log.setStatus("PENDING");

        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setKmRecorrido(1000);

        when(maintenanceLogRepository.findById(1L)).thenReturn(Optional.of(log));
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(maintenanceLogRepository.save(any(MaintenanceLog.class))).thenReturn(log);

        MaintenanceLog completed = maintenanceService.completeMaintenance(1L, "Done", 1200);

        assertEquals("COMPLETED", completed.getStatus());
        assertEquals(1200, completed.getMillaje());
        verify(vehicleRepository).save(any(Vehicle.class)); // Verify mileage update
    }
}
