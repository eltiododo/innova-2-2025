# Sistema de Gestión de Flotas y Logística - Módulo ML

Este proyecto implementa el módulo de Machine Learning para el Sistema de Gestión de Flotas y Logística (Grupo 1). Proporciona servicios de **Mantenimiento Predictivo** y **Optimización de Rutas** a través de una API RESTful.

## Contexto y Teoría

El objetivo de este módulo es mejorar la eficiencia operativa y reducir costos mediante el uso de inteligencia artificial.

### 1. Mantenimiento Predictivo
El mantenimiento predictivo busca anticipar fallas en los vehículos antes de que ocurran, permitiendo programar mantenimientos de manera proactiva.

*   **Enfoque**: Utilizamos un modelo de clasificación (**Random Forest**) entrenado con datos de telemetría vehicular.
*   **Variables**: El modelo analiza variables como kilometraje, antigüedad del vehículo, eficiencia de combustible, salud de la batería, salud del motor, velocidad promedio y aceleración promedio.
*   **Salida**: Predice si un vehículo necesita mantenimiento (`True`/`False`) y la probabilidad asociada.

### 2. Optimización de Rutas
La optimización de rutas busca encontrar la secuencia de paradas más eficiente para una flota de vehículos, minimizando la distancia total recorrida.

*   **Enfoque**: El problema se aborda en dos etapas:
    1.  **Clustering (K-Means)**: Agrupa las paradas geográficamente cercanas para asignarlas a diferentes vehículos.
    2.  **Routing (TSP - Greedy)**: Dentro de cada clúster, ordena las paradas para minimizar la distancia recorrida (Problema del Viajante).
*   **Salida**: Asignación de rutas optimizadas para cada vehículo de la flota.

## Estructura del Proyecto

```
.
├── data/               # Datasets (CSV)
├── docs/               # Documentación y PDFs
├── src/                # Código fuente
│   ├── api.py          # Aplicación FastAPI
│   ├── data_loader.py  # Carga y preprocesamiento de datos
│   ├── main.py         # Script CLI (legacy)
│   ├── predictive_maintenance.py # Lógica del modelo de mantenimiento
│   └── route_optimization.py     # Lógica de optimización de rutas
├── Dockerfile          # Definición del contenedor
├── requirements.txt    # Dependencias de Python
└── test_api.py         # Script de prueba de la API
```

## Instalación y Ejecución

### Opción A: Docker (Recomendada)

1.  **Construir la imagen**:
    ```bash
    docker build -t vehicle-telemetry .
    ```

2.  **Ejecutar el contenedor**:
    ```bash
    docker run -p 8000:8000 vehicle-telemetry
    ```

### Opción B: Ejecución Local

1.  **Crear entorno virtual e instalar dependencias**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

2.  **Iniciar el servidor**:
    ```bash
    uvicorn src.api:app --host 0.0.0.0 --port 8000
    ```

## Consumo de la API

La API expone los siguientes endpoints principales. Para documentación detallada, ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md) o visitar `/docs` cuando el servidor esté corriendo.

### 1. Predecir Mantenimiento
**POST** `/predict-maintenance`

Envía datos de telemetría de un vehículo para saber si requiere mantenimiento.

**Ejemplo de Body:**
```json
{
  "mileage": 50000,
  "vehicle_age": 5,
  "fuel_efficiency": 25.0,
  "battery_health": 80.0,
  "engine_health": 85.0,
  "avg_speed": 45.0,
  "avg_accel": 2.0,
  "odometer_reading": 50000
}
```

### 2. Optimizar Rutas
**POST** `/optimize-routes`

Envía una lista de ubicaciones (latitud, longitud) para generar rutas optimizadas.

**Ejemplo de Body:**
```json
{
  "locations": [
    {"lat": 34.0522, "long": -118.2437},
    {"lat": 34.0622, "long": -118.2537}
  ],
  "n_vehicles": 2
}
```
