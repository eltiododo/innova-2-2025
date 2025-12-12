# Guía de Incorporación del Modelo Predictivo al Backend

Esta guía detalla paso a paso cómo integrar tu modelo de Machine Learning (Python/Scikit-Learn) con tu backend en Spring Boot (Java).

La estrategia seleccionada es **Microservicio REST**:
1.  El modelo entrenado se guarda en un archivo.
2.  Un script ligero en Python (`api.py`) carga el modelo y lo expone como una API Web.
3.  El backend Java consulta esta API para obtener predicciones.

---

## Paso 1: Guardar el Modelo Entrenado

Necesitamos modificar tu script de entrenamiento para que, además de mostrar métricas, guarde el modelo en el disco para usarlo después.

1.  Instala `joblib` si no lo tienes:
    ```bash
    pip install joblib
    ```

2.  Modifica `src/predictive_maintenance.py`. Agrega la importación y el código para guardar al final de la función `train_maintenance_model`.

    ```python
    import joblib  # <--- Agregar importación

    def train_maintenance_model(df):
        # ... (código existente de entrenamiento) ...
        
        clf.fit(X_train, y_train)
        
        # ... (código existente de evaluación) ...
        
        # --- NUEVO: Guardar el modelo ---
        print("\nGuardando modelo en 'maintenance_model.pkl'...")
        joblib.dump(clf, 'maintenance_model.pkl')
        print("Modelo guardado exitosamente.")
        
        return clf, {'accuracy': accuracy, 'report': report, 'feature_ranking': feature_ranking}
    ```

3.  Ejecuta tu entrenamiento nuevamente para generar el archivo `maintenance_model.pkl`:
    ```bash
    python src/main.py
    ```

---

## Paso 2: Crear la API de Predicción (Python)

Crearemos un nuevo archivo `src/api.py` en tu proyecto `vehicle-telemetry-scikit`. Este script cargará el modelo y escuchará peticiones HTTP.

1.  Instala Flask:
    ```bash
    pip install flask
    ```

2.  Crea el archivo `src/api.py` con el siguiente contenido:

    ```python
    from flask import Flask, request, jsonify
    import joblib
    import pandas as pd
    import os

    app = Flask(__name__)

    # Cargar el modelo al iniciar
    MODEL_PATH = 'maintenance_model.pkl'
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Modelo cargado desde {MODEL_PATH}")
    else:
        print(f"ERROR: No se encontró {MODEL_PATH}. Ejecuta main.py primero.")
        model = None

    @app.route('/predict', methods=['POST'])
    def predict():
        if not model:
            return jsonify({'error': 'Model not loaded'}), 500

        try:
            data = request.get_json()
            
            # Esperamos los mismos features que en el entrenamiento
            # features = ['mileage', 'vehicle_age', 'fuel_efficiency', 'battery_health', 'engine_health', 'avg_speed', 'avg_accel', 'odometer_reading']
            
            # Convertir JSON a DataFrame
            df = pd.DataFrame([data])
            
            # Realizar predicción
            prediction = model.predict(df)
            
            # Devolver resultado (convertir numpy int a python int)
            result = int(prediction[0])
            
            return jsonify({
                'needs_maintenance': result,
                'status': 'success'
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    if __name__ == '__main__':
        app.run(port=5000, debug=True)
    ```

---

## Paso 3: Consumir la API desde Java (Spring Boot)

En tu proyecto `backend`, necesitas un servicio que llame a esta API Python.

1.  Crea una clase `PredictionService.java` (o agrégalo a un servicio existente).

    ```java
    package com.innova.demo.service;

    import org.springframework.stereotype.Service;
    import org.springframework.web.client.RestTemplate;
    import org.springframework.http.HttpEntity;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.MediaType;
    import java.util.HashMap;
    import java.util.Map;

    @Service
    public class PredictionService {

        private final String ML_API_URL = "http://localhost:5000/predict";
        private final RestTemplate restTemplate = new RestTemplate();

        public boolean predictMaintenance(Map<String, Object> vehicleData) {
            try {
                // Configurar headers
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Crear request
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(vehicleData, headers);

                // Llamar a la API Python
                Map<String, Object> response = restTemplate.postForObject(ML_API_URL, request, Map.class);

                if (response != null && response.containsKey("needs_maintenance")) {
                    Integer result = (Integer) response.get("needs_maintenance");
                    return result == 1;
                }

            } catch (Exception e) {
                System.err.println("Error llamando al servicio ML: " + e.getMessage());
                // Fallback o manejo de error
            }
            return false;
        }
    }
    ```

2.  **Ejemplo de Uso**:
    Donde necesites la predicción (ej. al recibir datos de telemetría), llama al servicio:

    ```java
    // ... dentro de tu Controller o Service ...
    
    Map<String, Object> data = new HashMap<>();
    data.put("mileage", 15000);
    data.put("vehicle_age", 3);
    data.put("fuel_efficiency", 12.5);
    data.put("battery_health", 95);
    data.put("engine_health", 88);
    data.put("avg_speed", 45.0);
    data.put("avg_accel", 2.1);
    data.put("odometer_reading", 45000);

    boolean needsMaintenance = predictionService.predictMaintenance(data);
    
    if (needsMaintenance) {
        System.out.println("ALERTA: El vehículo necesita mantenimiento.");
    }
    ```

---

## Resumen de Ejecución

Para que todo funcione, debes tener ambos procesos corriendo:

1.  **Terminal 1 (Python)**:
    ```bash
    cd vehicle-telemetry-scikit
    python src/api.py
    ```
    *Debe decir: `Running on http://127.0.0.1:5000`*

2.  **Terminal 2 (Java)**:
    Ejecuta tu aplicación Spring Boot normalmente.
