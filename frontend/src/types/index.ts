// Types matching the GraphQL schema from backend

export type Role = 'ADMIN' | 'USER' | 'DRIVER';

export interface User {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: Role;
}

export interface Vehicle {
    id: string;
    patente: string;
    marca: string;
    modelo: string;
    kmRecorrido: number;
    year?: number;
    fuelEfficiency?: number;
    batteryHealth?: number;
    engineHealth?: number;
    odometerReading?: number;
    driver: User;
}

export interface VehicleInput {
    patente: string;
    marca: string;
    modelo: string;
    kmRecorrido: number;
    year?: number;
    fuelEfficiency?: number;
    batteryHealth?: number;
    engineHealth?: number;
    odometerReading?: number;
    driverId: string;
}

export interface Point {
    x: number;
    y: number;
}

export interface Workshop {
    id: string;
    name: string;
    direction: string;
    location?: Point;
}

export interface TravelLog {
    id: string;
    vehicle: Vehicle;
    startPosition: Point;
    endPosition: Point;
    avgSpeed?: number;
    avgAcceleration?: number;
    state?: string;
    arrivalTime?: string;
    createdAt?: string;
}

export interface TravelLogInput {
    vehicleId: string;
    startLatitude: number;
    startLongitude: number;
    endLatitude?: number;
    endLongitude?: number;
    avgSpeed?: number;
    avgAcceleration?: number;
    state?: string;
}

export interface MaintenanceTicket {
    id: string;
    vehicleID: string;
    workshopId: string;
    fechaMantencion?: string;
    status: string;
    millaje?: number;
    notasExtra?: string;
    createdAt?: string;
}

export interface MaintenanceTicketInput {
    vehicleId: string;
    workshopId: string;
    fechaMantencion: number;
    status: string;
    millaje?: number;
    notasExtra?: string;
}

export interface ScheduledMaintenanceInput {
    qrCodeId: string;
    workshopId: string;
    date?: string;
}

// ML API types (Python service)
export interface MaintenancePredictionInput {
    mileage: number;
    vehicle_age: number;
    fuel_efficiency: number;
    battery_health: number;
    engine_health: number;
    avg_speed: number;
    avg_accel: number;
    odometer_reading: number;
}

export interface MaintenancePredictionResponse {
    needs_maintenance: boolean;
    maintenance_probability: number;
    input_data: MaintenancePredictionInput;
}

export interface RouteLocation {
    lat: number;
    long: number;
}

export interface RouteOptimizationInput {
    locations: RouteLocation[];
    n_vehicles?: number;
}

export interface RouteOptimizationResponse {
    routes: Record<string, [number, number][]>;
}

// Vehicle status for UI
export type VehicleStatus = 'operational' | 'pending_review' | 'in_maintenance';

export interface VehicleWithStatus extends Vehicle {
    status: VehicleStatus;
    maintenanceTickets?: MaintenanceTicket[];
}

// Action types for vehicle actions
export type VehicleAction =
    | 'maintenance'
    | 'check_status'
    | 'request_info'
    | 'schedule_pickup';

export const VEHICLE_ACTIONS: { value: VehicleAction; label: string }[] = [
    { value: 'maintenance', label: 'Enviar a mantención' },
    { value: 'check_status', label: 'Consultar estado' },
    { value: 'request_info', label: 'Solicitar información' },
    { value: 'schedule_pickup', label: 'Programar recogida' },
];
