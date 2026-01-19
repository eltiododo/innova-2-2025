import { useState, useEffect } from 'react';
import { VehicleCard } from '@/components/vehicle-card';
import { VehicleDetailDialog } from '@/components/vehicle-detail-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Filter, Car } from 'lucide-react';
import type { VehicleWithStatus, VehicleStatus } from '@/types';
// import { getVehicles } from '@/services/vehicles';

// Mock data for development
const mockVehicles: VehicleWithStatus[] = [
    {
        id: '1',
        patente: 'ABCD-12',
        marca: 'Toyota',
        modelo: 'Hilux',
        kmRecorrido: 45000,
        year: 2022,
        fuelEfficiency: 12.5,
        batteryHealth: 95,
        engineHealth: 88,
        odometerReading: 45000,
        driver: { id: '1', username: 'Juan Pérez', email: 'juan@email.com', phone: '+56912345678', role: 'DRIVER' },
        status: 'operational',
    },
    {
        id: '2',
        patente: 'EFGH-34',
        marca: 'Ford',
        modelo: 'Ranger',
        kmRecorrido: 62000,
        year: 2021,
        fuelEfficiency: 11.8,
        batteryHealth: 82,
        engineHealth: 75,
        odometerReading: 62000,
        driver: { id: '2', username: 'María García', email: 'maria@email.com', phone: '+56987654321', role: 'DRIVER' },
        status: 'pending_review',
    },
    {
        id: '3',
        patente: 'IJKL-56',
        marca: 'Chevrolet',
        modelo: 'D-Max',
        kmRecorrido: 78000,
        year: 2020,
        fuelEfficiency: 10.2,
        batteryHealth: 65,
        engineHealth: 60,
        odometerReading: 78000,
        driver: { id: '3', username: 'Carlos López', email: 'carlos@email.com', phone: '+56911223344', role: 'DRIVER' },
        status: 'in_maintenance',
    },
    {
        id: '4',
        patente: 'MNOP-78',
        marca: 'Nissan',
        modelo: 'Navara',
        kmRecorrido: 35000,
        year: 2023,
        fuelEfficiency: 13.5,
        batteryHealth: 98,
        engineHealth: 95,
        odometerReading: 35000,
        driver: { id: '4', username: 'Ana Martínez', email: 'ana@email.com', phone: '+56955667788', role: 'DRIVER' },
        status: 'operational',
    },
    {
        id: '5',
        patente: 'QRST-90',
        marca: 'Mitsubishi',
        modelo: 'L200',
        kmRecorrido: 52000,
        year: 2021,
        fuelEfficiency: 11.2,
        batteryHealth: 88,
        engineHealth: 82,
        odometerReading: 52000,
        driver: { id: '5', username: 'Pedro Sánchez', email: 'pedro@email.com', phone: '+56999887766', role: 'DRIVER' },
        status: 'operational',
    },
    {
        id: '6',
        patente: 'UVWX-11',
        marca: 'Isuzu',
        modelo: 'D-Max',
        kmRecorrido: 41000,
        year: 2022,
        fuelEfficiency: 12.8,
        batteryHealth: 92,
        engineHealth: 90,
        odometerReading: 41000,
        driver: { id: '6', username: 'Laura Torres', email: 'laura@email.com', phone: '+56944556677', role: 'DRIVER' },
        status: 'pending_review',
    },
];

export function FleetPage() {
    const [vehicles] = useState<VehicleWithStatus[]>(mockVehicles);
    const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithStatus[]>(mockVehicles);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithStatus | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        // TODO: Fetch real data
        // getVehicles().then(data => setVehicles(data));
    }, []);

    useEffect(() => {
        let filtered = vehicles;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (v) =>
                    v.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.driver?.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((v) => v.status === statusFilter);
        }

        setFilteredVehicles(filtered);
    }, [vehicles, searchTerm, statusFilter]);

    const handleVehicleClick = (vehicle: VehicleWithStatus) => {
        setSelectedVehicle(vehicle);
        setDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Car className="h-8 w-8 text-blue-500" />
                        Flota de Vehículos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona todos los vehículos de la empresa
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Vehículo
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por patente, marca, modelo o conductor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as VehicleStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="operational">Operativo</SelectItem>
                        <SelectItem value="pending_review">Revisión Pendiente</SelectItem>
                        <SelectItem value="in_maintenance">En Mantención</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Total: <strong className="text-foreground">{vehicles.length}</strong></span>
                <span>Mostrando: <strong className="text-foreground">{filteredVehicles.length}</strong></span>
            </div>

            {/* Vehicle Grid */}
            {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onClick={() => handleVehicleClick(vehicle)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Car className="w-16 h-16 mx-auto text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No se encontraron vehículos</h3>
                    <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}

            {/* Vehicle Detail Dialog */}
            <VehicleDetailDialog
                vehicle={selectedVehicle}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
}
