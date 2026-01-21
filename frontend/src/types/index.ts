

export type Role = 'ADMIN' | 'USER' | 'DRIVER';

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
}

export interface RouteLocation {
    lat: number;
    long: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface OptimizeRoutesRequest {
    locations: RouteLocation[];
    n_vehicles: number;
}

export interface OptimizeRoutesResponse {
    routes: Record<string, [number, number][]>;
    total_distance?: number;
    execution_time?: number;
}

export type RouteOptimizationInput = OptimizeRoutesRequest;
export type RouteOptimizationResponse = OptimizeRoutesResponse;

export interface MaintenancePredictionInput {
    vehicle_id: string;
    mileage: number;
    days_since_last_maintenance: number;
    engine_hours: number;
}

export interface MaintenancePredictionResponse {
    vehicle_id: string;
    maintenance_probability: number;
    recommended_action: string;
    predicted_failure_days?: number;
}

export type VehicleStatus = 'OPERATIONAL' | 'PENDING_REVIEW' | 'IN_MAINTENANCE';

export interface MaintenanceTicket {
    id: string;
    description: string;
    status: string;
    createdAt: string;
}

export interface Vehicle {
    id: string;
    patente: string;
    marca: string;
    modelo: string;
    year?: number;
    kmRecorrido: number;
    batteryHealth?: number;
    engineHealth?: number;
    fuelEfficiency?: number;
    driver?: {
        id: string;
        username: string;
    };
}


export interface VehicleWithStatus extends Vehicle {
    status: VehicleStatus;
    maintenanceTickets?: MaintenanceTicket[];
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

export type VehicleAction =
    | 'maintenance'
    | 'check_status'
    | 'request_info'
    | 'schedule_pickup'
    | 'pickup'
    | 'delivery'
    | 'inspection';

export const VEHICLE_ACTIONS: { value: VehicleAction; label: string }[] = [
    { value: 'maintenance', label: 'Enviar a mantención' },
    { value: 'check_status', label: 'Consultar estado' },
    { value: 'request_info', label: 'Solicitar información' },
    { value: 'schedule_pickup', label: 'Programar recogida' },
    { value: 'pickup', label: 'Recoger' },
    { value: 'delivery', label: 'Entregar' },
    { value: 'inspection', label: 'Inspección' },
];
