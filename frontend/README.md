# 🎨 FleetIQ Frontend - Aplicación React

## 📋 Descripción

Frontend del sistema FleetIQ desarrollado con **React 18**, **TypeScript**, y **Vite**. Proporciona una interfaz moderna y responsiva para la gestión de flotas vehiculares.

## 🏗️ Arquitectura

```
src/
├── App.tsx                    # Componente principal y rutas
├── main.tsx                   # Punto de entrada
├── index.css                  # Estilos globales
│
├── pages/                     # Páginas de la aplicación
│   ├── dashboard.tsx          # Panel principal con métricas
│   ├── fleet.tsx              # Gestión de flota
│   ├── map.tsx                # Mapa en tiempo real
│   ├── reports.tsx            # Reportes y análisis
│   └── login.tsx              # Autenticación
│
├── components/                # Componentes reutilizables
│   ├── ui/                    # Componentes base (shadcn/ui)
│   ├── layout/                # Componentes de layout
│   ├── sidebar.tsx            # Navegación lateral
│   ├── vehicle-card.tsx       # Tarjeta de vehículo
│   ├── vehicle-detail-dialog.tsx  # Modal de detalles
│   └── status-badge.tsx       # Badge de estado
│
├── services/                  # Servicios API
│   ├── vehicles.ts            # API de vehículos
│   ├── maintenance.ts         # API de mantenimiento
│   ├── travel-logs.ts         # API de viajes
│   ├── ml-api.ts              # API de Machine Learning
│   └── qr-api.ts              # API de códigos QR
│
├── stores/                    # Estado global (MobX)
│   ├── auth.store.ts          # Estado de autenticación
│   └── index.ts               # Configuración de stores
│
├── lib/                       # Utilidades
│   ├── apollo-client.ts       # Cliente GraphQL
│   └── utils.ts               # Funciones auxiliares
│
└── types/                     # Definiciones TypeScript
    └── index.ts               # Tipos globales
```

## 📱 Páginas Principales

### 🏠 Dashboard (`/dashboard`)
Panel principal con visualización de métricas clave:
- Total de vehículos
- Eficiencia de combustible promedio
- Vehículos en mantenimiento
- Gráficos de tendencias (últimos 6 meses)
- Tiempos de viaje promedio

### 🚗 Flota (`/fleet`)
Gestión completa de vehículos:
- Lista de vehículos con filtros
- Estado operacional (Operacional, En revisión, En mantenimiento)
- Detalles de telemetría
- Predicción de mantenimiento con IA
- Generación de códigos QR

### 🗺️ Mapa (`/map`)
Visualización geográfica en tiempo real:
- Posición actual de vehículos
- Historial de rutas
- Optimización de rutas con IA
- Integración con Leaflet

### 📊 Reportes (`/reports`)
Análisis y reportes:
- Reportes de mantenimiento
- Análisis de eficiencia
- Predicciones de mantenimiento
- Exportación de datos

### 🔐 Login (`/login`)
Autenticación de usuarios:
- Inicio de sesión con email/contraseña
- Protección de rutas
- Manejo de sesiones con JWT

## 🔧 Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.3 | Framework UI |
| TypeScript | 5.9 | Tipado estático |
| Vite | 5.4 | Build tool y dev server |
| TailwindCSS | 3.4 | Estilos |
| MobX | 6.15 | Estado global |
| TanStack Query | 5.90 | Fetching y cache |
| React Router | 6.30 | Navegación |
| Recharts | 2.15 | Gráficos |
| Leaflet | 1.9 | Mapas |
| Radix UI | - | Componentes accesibles |
| Lucide React | - | Iconos |

## 🔐 Gestión de Estado

### MobX Store

El estado de autenticación se gestiona con MobX:

```typescript
// stores/auth.store.ts
class AuthStore {
  user: User | null = null;
  token: string | null = null;
  isAuthenticated: boolean = false;

  login(email: string, password: string): Promise<void>;
  logout(): void;
  checkAuth(): void;
}
```

### TanStack Query

Para fetching de datos y cache:

```typescript
// Ejemplo de uso
const { data, isLoading } = useQuery({
  queryKey: ['vehicles'],
  queryFn: () => vehiclesService.getAll()
});
```

## 📡 Servicios API

### VehiclesService
```typescript
// services/vehicles.ts
- getAll(): Promise<Vehicle[]>
- getById(id: string): Promise<Vehicle>
- create(vehicle: VehicleInput): Promise<Vehicle>
```

### MaintenanceService
```typescript
// services/maintenance.ts
- getPrediction(vehicleId: string): Promise<MaintenancePrediction>
- scheduleMaintenace(input: ScheduleInput): Promise<MaintenanceTicket>
```

### MLApiService
```typescript
// services/ml-api.ts
- predictMaintenance(telemetry: TelemetryData): Promise<Prediction>
- optimizeRoutes(locations: Location[]): Promise<OptimizedRoutes>
```

## 🎨 Sistema de Diseño

### Componentes UI (shadcn/ui)

Componentes base disponibles en `components/ui/`:

| Componente | Uso |
|------------|-----|
| `Button` | Botones con variantes |
| `Card` | Contenedores de contenido |
| `Dialog` | Modales y diálogos |
| `Input` | Campos de entrada |
| `Label` | Etiquetas de formulario |
| `Select` | Selectores desplegables |
| `Checkbox` | Casillas de verificación |
| `Avatar` | Avatares de usuario |
| `Separator` | Separadores visuales |
| `Tooltip` | Tooltips informativos |

### Tema de Colores

Configurado en `tailwind.config.js`:

```javascript
colors: {
  primary: {...},    // Color principal
  secondary: {...},  // Color secundario
  background: {...}, // Fondos
  foreground: {...}, // Texto
  muted: {...},      // Elementos sutiles
  accent: {...},     // Acentos
  destructive: {...} // Acciones destructivas
}
```

## 🚀 Ejecución

### Prerrequisitos
- Node.js 18+ o Bun
- Backend corriendo en `localhost:8080`

### Desarrollo Local

```bash
# Con Bun (recomendado)
bun install
bun dev

# Con npm
npm install
npm run dev
```

### Build de Producción

```bash
bun run build
# o
npm run build
```

### Preview de Producción

```bash
bun run preview
# o
npm run preview
```

### Docker

```bash
docker build -t innova-frontend .
docker run -p 5173:5173 innova-frontend
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:8080
VITE_ML_API_URL=http://localhost:8000
```

### Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
```

## 📁 Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts |
| `vite.config.ts` | Configuración de Vite |
| `tailwind.config.js` | Configuración de Tailwind |
| `tsconfig.json` | Configuración de TypeScript |
| `components.json` | Configuración de shadcn/ui |
| `postcss.config.js` | Configuración de PostCSS |
| `Dockerfile` | Imagen Docker |
| `.env` | Variables de entorno |

## 🔒 Protección de Rutas

El componente `ProtectedRoute` en `App.tsx` maneja la autenticación:

```tsx
// Solo usuarios autenticados pueden acceder
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Redirige a dashboard si ya está autenticado
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

## 🗺️ Navegación

### Rutas Disponibles

| Ruta | Componente | Acceso |
|------|------------|--------|
| `/login` | LoginPage | Público |
| `/dashboard` | DashboardPage | Protegido |
| `/fleet` | FleetPage | Protegido |
| `/map` | MapPage | Protegido |
| `/reports` | ReportsPage | Protegido |
| `/` | Redirect → /dashboard | - |

## 📊 Gráficos

Se utilizan las siguientes librerías para visualización:

- **Recharts**: Gráficos de línea, barra y área para el dashboard
- **Chart.js + react-chartjs-2**: Gráficos adicionales en reportes

```tsx
// Ejemplo de uso de Recharts
<LineChart data={data}>
  <XAxis dataKey="month" />
  <YAxis />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
```

---

<div align="center">
  <strong>Frontend FleetIQ - React + TypeScript + Vite</strong>
</div>
