# 🔧 FleetIQ Backend - API Spring Boot

## 📋 Descripción

Backend del sistema FleetIQ desarrollado con **Spring Boot 3.3.5** y **GraphQL**. Proporciona una API robusta para la gestión de flotas, autenticación de usuarios, y comunicación con el módulo de Machine Learning.

## 🏗️ Arquitectura

El backend sigue una arquitectura en capas bien definida:

```
src/main/java/com/innova/flota/
├── InnovaApplication.java      # Punto de entrada
├── config/                     # Configuraciones de seguridad, CORS
├── controllers/                # Controladores REST
├── resolvers/                  # Resolvers GraphQL
├── services/                   # Lógica de negocio
├── repositories/               # Acceso a datos (JPA)
└── model/                      # Entidades JPA
```

## 🗃️ Modelo de Datos

### Diagrama Entidad-Relación

```
┌─────────┐       ┌───────────┐       ┌─────────────────┐
│  Users  │──────▶│  Vehicle  │──────▶│ MaintenanceTicket│
└─────────┘       └───────────┘       └─────────────────┘
     │                  │                     │
     │                  ▼                     │
     │            ┌───────────┐               │
     │            │ TravelLog │               │
     │            └───────────┘               │
     │                                        ▼
     │                               ┌───────────┐
     └──────────────────────────────▶│ Workshop  │
                                     └───────────┘
```

### Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| **Users** | Usuarios del sistema (Admin, User, Driver) |
| **Vehicle** | Vehículos de la flota con telemetría |
| **TravelLog** | Registros de viajes con posiciones GPS |
| **MaintenanceTicket** | Tickets de mantenimiento programados |
| **Workshop** | Talleres asociados para mantenimiento |
| **QRCode** | Códigos QR para identificación de vehículos |

## 🔌 API GraphQL

### Endpoint Principal

```
POST /graphql
GET  /graphiql    # Playground interactivo
```

### Queries Disponibles

```graphql
# Obtener todos los vehículos
query {
  vehicles {
    id
    patente
    marca
    modelo
    status
    kmRecorrido
    driver {
      username
    }
  }
}

# Obtener estadísticas del dashboard
query {
  dashboardStats {
    totalVehicles
    avgFuelEfficiency
    vehiclesInMaintenance
    fuelEfficiencyLast6Months {
      month
      value
    }
  }
}

# Obtener usuario autenticado
query {
  me {
    id
    username
    email
    role
  }
}
```

### Mutations Disponibles

```graphql
# Registrar nuevo usuario
mutation {
  register(input: {
    username: "nuevo_usuario"
    email: "usuario@email.com"
    password: "password123"
    phone: "+56912345678"
    role: "USER"
  }) {
    token
    user {
      id
      username
    }
  }
}

# Iniciar sesión
mutation {
  login(input: {
    email: "usuario@email.com"
    password: "password123"
  }) {
    token
    user {
      id
      username
      role
    }
  }
}

# Agregar un vehículo
mutation {
  addVehicle(vehicle: {
    patente: "ABCD12"
    marca: "Toyota"
    modelo: "Hilux"
    kmRecorrido: 50000
    year: 2022
    driverId: "1"
  }) {
    id
    patente
  }
}

# Registrar un viaje
mutation {
  addTravelLog(travelLog: {
    vehicleId: "1"
    startLatitude: -33.4489
    startLongitude: -70.6693
    avgSpeed: 45.5
  }) {
    id
    vehicle {
      patente
    }
  }
}
```

## 🔐 Autenticación y Seguridad

### JWT (JSON Web Tokens)

El sistema utiliza JWT para autenticación stateless:

1. **Login**: El usuario envía credenciales y recibe un token
2. **Autorización**: El token se envía en el header `Authorization: Bearer <token>`
3. **Validación**: El backend valida el token en cada request

### Configuración JWT

```properties
jwt.secret=my-super-secret-key-for-jwt-that-must-be-at-least-256-bits-long-for-hs256
jwt.expiration=86400000  # 24 horas
```

### Roles

| Rol | Permisos |
|-----|----------|
| `ADMIN` | Acceso completo a todas las funcionalidades |
| `USER` | Dashboard, reportes, visualización de flota |
| `DRIVER` | Información limitada al vehículo asignado |

## 🔧 Servicios Principales

### VehicleService
Gestión de vehículos y su estado operacional.

### DashboardService
Generación de estadísticas y métricas para el dashboard.

### PredictionService
Integración con la API de ML para predicciones de mantenimiento.

### EmailService
Envío de notificaciones por correo electrónico.

### QrGenerator
Generación de códigos QR para identificación de vehículos.

## 📡 Integración con ML API

El backend se comunica con la API de Machine Learning para:

- **Predicción de Mantenimiento**: Envía telemetría del vehículo y recibe predicciones
- **Optimización de Rutas**: Envía ubicaciones y recibe rutas optimizadas

```java
// Ejemplo de llamada al servicio de predicción
PredictionService.predict(vehicle) → MaintenancePredict
```

### Configuración

```properties
ml.api.url=${ML_API_URL:http://localhost:8000/predict}
```

## 🗄️ Base de Datos

### Configuración PostgreSQL

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:5432/postgres
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
```

### Inicialización

El esquema se crea automáticamente con Hibernate y los datos iniciales se cargan desde `data.sql`.

```properties
spring.jpa.hibernate.ddl-auto=create
spring.sql.init.mode=always
```

## 🚀 Ejecución

### Desarrollo Local

```bash
# Con Maven Wrapper
./mvnw spring-boot:run

# Con Maven instalado
mvn spring-boot:run
```

### Docker

```bash
# Construir imagen
docker build -t innova-backend .

# Ejecutar
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  innova-backend
```

## 📦 Dependencias Principales

| Dependencia | Versión | Uso |
|-------------|---------|-----|
| Spring Boot | 3.3.5 | Framework base |
| Spring GraphQL | - | API GraphQL |
| Spring Security | - | Autenticación/Autorización |
| Spring Data JPA | - | Persistencia |
| PostgreSQL Driver | - | Conexión a BD |
| JJWT | 0.12.3 | Tokens JWT |
| Lombok | - | Reducción de boilerplate |
| SpringDoc OpenAPI | 2.5.0 | Documentación API REST |
| ZXing | 3.3.0 | Generación de QR |

## 📁 Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `pom.xml` | Dependencias y build Maven |
| `application.properties` | Configuración de Spring |
| `schema.graphqls` | Esquema GraphQL |
| `data.sql` | Datos iniciales de la BD |
| `Dockerfile` | Imagen Docker |

## 🔗 Endpoints REST Adicionales

Además de GraphQL, hay endpoints REST para funcionalidades específicas:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/qr/generate/{vehicleId}` | GET | Genera código QR para vehículo |
| `/api/qr/email` | POST | Envía QR por correo electrónico |

---

<div align="center">
  <strong>Backend FleetIQ - Spring Boot + GraphQL</strong>
</div>
