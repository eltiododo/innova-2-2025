# Métricas de Desempeño del Modelo - Sección 3.5 IA

## Modelo de Mantenimiento Predictivo

**Algoritmo:** Random Forest Classifier

**Objetivo:** Predicción binaria de necesidad de mantenimiento vehicular

### Métricas Principales

| Métrica | Valor | Descripción |
| --- | --- | --- |
| **Accuracy** | 0.9913 | Precisión global del modelo |
| **Precision** | 0.9890 | Proporción de predicciones positivas correctas |
| **Recall** | 0.9926 | Proporción de casos positivos detectados |
| **F1-Score** | 0.9908 | Media armónica de Precision y Recall |
| **ROC-AUC** | 0.9998 | Área bajo la curva ROC |
| **CV F1 (5-fold)** | 0.9882 ± 0.0222 | Validación cruzada |

### Métricas por Clase

| Clase | Precision | Recall | F1-Score |
| --- | --- | --- | --- |
| No requiere mantenimiento (0) | 0.9934 | 0.9902 | 0.9918 |
| Requiere mantenimiento (1) | 0.9890 | 0.9926 | 0.9908 |
| **Promedio Ponderado** | 0.9914 | 0.9913 | 0.9914 |

---

## Modelo de Optimización de Rutas

**Algoritmo:** Greedy TSP + Distancia Haversine

**Objetivo:** Minimizar distancia total de recorrido

### Resultados de Optimización

| Escenario | Puntos | Dist. Original (km) | Dist. Optimizada (km) | Ahorro (%) | Tiempo (ms) |
| --- | --- | --- | --- | --- | --- |
| Ruta Urbana (5 puntos) | 5 | 30.70 | 24.50 | 20.2% | 0.07 |
| Ruta Suburbana (10 puntos) | 10 | 119.39 | 71.93 | 39.8% | 0.18 |
| Ruta Metropolitana (20 puntos) | 20 | 445.05 | 158.26 | 64.4% | 0.67 |

### Parámetros del Algoritmo

| Parámetro | Valor | Descripción |
| --- | --- | --- |
| Precisión Haversine | ±0.5% | Error respecto a distancia geodésica real |
| Factor de Tortuosidad | 1.4x | Ajuste de distancia aérea a distancia por carretera |
| Ahorro Promedio | 41.5% | Reducción de distancia vs. ruta secuencial |
| Complejidad | O(n²) | Complejidad temporal del algoritmo greedy |
