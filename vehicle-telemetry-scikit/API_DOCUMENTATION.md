# Documentación de la API - Vehicle Telemetry

Esta API permite interactuar con los modelos de Machine Learning para mantenimiento predictivo y optimización de rutas.

**Base URL**: `http://localhost:8000`

## Endpoints

### 1. Health Check
Verifica el estado del servicio y si el modelo ha sido cargado correctamente.

*   **URL**: `/health`
*   **Método**: `GET`
*   **Respuesta Exitosa (200 OK)**:
    ```json
    {
      "status": "healthy",
      "model_loaded": true
    }
    ```

---

### 2. Predict Maintenance
Predice si un vehículo necesita mantenimiento basándose en sus datos de telemetría.

*   **URL**: `/predict-maintenance`
*   **Método**: `POST`
*   **Content-Type**: `application/json`
*   **Parámetros del Body**:

| Campo | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `mileage` | float | Kilometraje total (o estimado) | 50000.0 |
| `vehicle_age` | int | Antigüedad del vehículo en años | 5 |
| `fuel_efficiency` | float | Eficiencia de combustible (mpg o km/l) | 25.0 |
| `battery_health` | float | Salud de la batería (0-100) | 80.0 |
| `engine_health` | float | Salud del motor (0-100) | 85.0 |
| `avg_speed` | float | Velocidad promedio | 45.0 |
| `avg_accel` | float | Aceleración promedio | 2.0 |
| `odometer_reading` | float | Lectura del odómetro | 50000.0 |

*   **Respuesta Exitosa (200 OK)**:
    ```json
    {
      "needs_maintenance": false,
      "maintenance_probability": 0.24,
      "input_data": { ... }
    }
    ```
    *   `needs_maintenance`: Booleano indicando si se recomienda mantenimiento.
    *   `maintenance_probability`: Probabilidad (0.0 - 1.0) de necesitar mantenimiento.

*   **Errores**:
    *   `503 Service Unavailable`: Si el modelo no está entrenado o cargado.

---

### 3. Optimize Routes
Genera rutas optimizadas para una flota de vehículos dadas una lista de ubicaciones.

*   **URL**: `/optimize-routes`
*   **Método**: `POST`
*   **Content-Type**: `application/json`
*   **Parámetros del Body**:

| Campo | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `locations` | List[Object] | Lista de objetos con `lat` y `long` | `[{"lat": 34.0, "long": -118.2}]` |
| `n_vehicles` | int | Número de vehículos disponibles (Default: 5) | 2 |

*   **Respuesta Exitosa (200 OK)**:
    ```json
    {
      "routes": {
        "0": [
          [34.0522, -118.2437],
          [34.0622, -118.2537],
          [34.0522, -118.2437]
        ],
        "1": [ ... ]
      }
    }
    ```
    *   `routes`: Diccionario donde la clave es el ID del vehículo (como string) y el valor es una lista de coordenadas `[lat, long]` que representan la ruta ordenada.

*   **Errores**:
    *   `400 Bad Request`: Si no se envían ubicaciones.
    *   `500 Internal Server Error`: Si ocurre un error durante el cálculo.
