# 🚛 FleetIQ - Sistema de Gestión de Flotas y Logística

<div align="center">

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Java](https://img.shields.io/badge/Java-17-orange)
![React](https://img.shields.io/badge/React-18.3-blue)
![Python](https://img.shields.io/badge/Python-3.11-green)

</div>

## 📋 Descripción

**FleetIQ** es un sistema integral de gestión de flotas y logística que permite el monitoreo en tiempo real de vehículos, predicción de mantenimiento mediante inteligencia artificial, y optimización de rutas. Desarrollado como proyecto de innovación para el curso de Innovación y Emprendimiento.

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura de microservicios con tres componentes principales:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FleetIQ Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐ │
│  │  Frontend   │     │     Backend      │     │     ML API       │ │
│  │  (React)    │────▶│  (Spring Boot)   │────▶│   (FastAPI)      │ │
│  │  :5173      │     │     :8080        │     │    :8000         │ │
│  └─────────────┘     └────────┬─────────┘     └──────────────────┘ │
│                               │                                     │
│                               ▼                                     │
│                      ┌──────────────────┐                          │
│                      │   PostgreSQL     │                          │
│                      │     :5432        │                          │
│                      └──────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
innova-2-2025/
├── backend/                    # API Backend (Spring Boot + GraphQL)
│   ├── src/main/java/         # Código fuente Java
│   ├── src/main/resources/    # Configuraciones y esquema GraphQL
│   └── pom.xml                # Dependencias Maven
│
├── frontend/                   # Aplicación Web (React + Vite)
│   ├── src/                   # Código fuente TypeScript/React
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── services/         # Servicios API
│   │   └── stores/           # Estado global (MobX)
│   └── package.json          # Dependencias npm
│
├── vehicle-telemetry-scikit/   # Módulo de Machine Learning
│   ├── src/                   # Código fuente Python
│   ├── data/                  # Datasets de entrenamiento
│   └── requirements.txt       # Dependencias Python
│
└── docker-compose.yml          # Orquestación de contenedores
```

## 🚀 Funcionalidades Principales

### 📊 Dashboard
- Visualización de estadísticas de la flota en tiempo real
- Gráficos de eficiencia de combustible
- Métricas de tiempos de viaje
- Estado de mantenimientos

### 🚗 Gestión de Flota
- Registro y seguimiento de vehículos
- Estado operacional de cada unidad
- Historial de mantenimientos
- Generación de códigos QR para identificación

### 🗺️ Mapa en Tiempo Real
- Visualización de posición de vehículos
- Historial de rutas
- Optimización de rutas con IA

### 📝 Reportes
- Reportes de mantenimiento
- Análisis de eficiencia
- Predicciones de mantenimiento

### 🔮 Machine Learning
- **Mantenimiento Predictivo**: Predicción de necesidades de mantenimiento usando Random Forest
- **Optimización de Rutas**: Clustering con K-Means y resolución TSP

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, MobX, TanStack Query |
| **Backend** | Spring Boot 3.3.5, GraphQL, Spring Security, JWT |
| **ML API** | Python 3.11, FastAPI, scikit-learn, pandas |
| **Base de Datos** | PostgreSQL 17 |
| **Contenedores** | Docker, Docker Compose |

## 🐳 Inicio Rápido con Docker

### Prerrequisitos
- Docker y Docker Compose instalados
- Variables de entorno configuradas (opcional para email)

### Ejecutar el Sistema Completo

```bash
# Clonar el repositorio
git clone https://github.com/eltiododo/innova-2-2025.git
cd innova-2-2025

# Iniciar todos los servicios
docker-compose up -d

# Verificar estado
docker-compose ps
```

### Acceder a los Servicios

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| GraphQL Playground | http://localhost:8080/graphiql |
| ML API Docs | http://localhost:8000/docs |

## 💻 Desarrollo Local

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (React + Vite)

```bash
cd frontend
bun install  # o npm install
bun dev      # o npm run dev
```

### ML API (Python)

```bash
cd vehicle-telemetry-scikit
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.api:app --reload
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Las credenciales por defecto para desarrollo están en `data.sql`.

### Roles de Usuario
- **ADMIN**: Acceso completo al sistema
- **USER**: Acceso a dashboard y reportes
- **DRIVER**: Acceso limitado a información del vehículo asignado

## 📖 Documentación Detallada

- [📘 Backend - Documentación Técnica](./backend/README.md)
- [📗 Frontend - Documentación Técnica](./frontend/README.md)
- [📙 ML API - Documentación Técnica](./vehicle-telemetry-scikit/README.md)
- [📕 API ML - Endpoints](./vehicle-telemetry-scikit/API_DOCUMENTATION.md)

## 🌐 Variables de Entorno

### Backend
| Variable | Descripción | Default |
|----------|-------------|---------|
| `DB_HOST` | Host de PostgreSQL | localhost |
| `DB_USER` | Usuario de BD | postgres |
| `DB_PASSWORD` | Contraseña de BD | postgres |
| `ML_API_URL` | URL de la API de ML | http://localhost:8000/predict |
| `EMAIL_USERNAME` | Email para notificaciones | - |
| `EMAIL_PASSWORD` | App password de Gmail | - |

### Frontend
| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend | http://localhost:8080 |

## 👥 Equipo de Desarrollo

**Grupo 1 - Innovación y Emprendimiento 2025**

## 📄 Licencia

Este proyecto es parte del curso de Innovación y Emprendimiento - Universidad, Nivel 8.

---

<div align="center">
  <strong>🚀 FleetIQ - Gestión Inteligente de Flotas</strong>
</div>
