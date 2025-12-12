# Documentación de API - Sistema de Gestión de Flotas

Este documento describe los endpoints disponibles en los servicios del sistema.

## 1. Servicio de Machine Learning (Python)
**Base URL**: `http://localhost:8000`

### 1.1 Predicción de Mantenimiento
Determina si un vehículo necesita mantenimiento basado en su telemetría.

- **Endpoint**: `POST /predict`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "mileage": 15000.0,
    "vehicle_age": 3,
    "fuel_efficiency": 12.5,
    "battery_health": 95.0,
    "engine_health": 88.0,
    "avg_speed": 45.0,
    "avg_accel": 2.1,
    "odometer_reading": 45000.0
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "needs_maintenance": false,
    "maintenance_probability": 0.33,
    "input_data": { ... }
  }
  ```

### 1.2 Optimización de Rutas (En desarrollo)
- **Endpoint**: `POST /optimize-routes`
- **Body**:
  ```json
  {
      "vehicle_id": "V001",
      "start_location": {"lat": -33.45, "long": -70.66},
      "end_location": {"lat": -33.40, "long": -70.60},
      "avg_speed": 50.0,
      "arrival_time": "2023-12-12T10:00:00Z"
  }
  ```

---

## 2. Backend (Java Spring Boot)
**Base URL**: `http://localhost:8080`

### 2.1 Endpoints de Vehículos (Ejemplos)
*Nota: Estos endpoints dependen de la implementación actual en `VehicleController`.*

- **Listar Vehículos**: `GET /api/vehicles`
- **Crear Vehículo**: `POST /api/vehicles`

### 2.2 Integración de Mantenimiento
El servicio `PredictionService` se utiliza internamente. Para probarlo, se debe invocar la lógica de negocio que dispara la predicción (ej. al registrar una lectura de telemetría o finalizar un viaje).

## 3. Ejecución con Docker Compose

Para levantar todo el sistema:

```bash
docker-compose up --build
```

Esto iniciará:
1.  **PostgreSQL**: Puerto 5432
2.  **ML API**: Puerto 8000
3.  **Backend**: Puerto 8080
