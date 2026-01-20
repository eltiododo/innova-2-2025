import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
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
import { Search, Car } from 'lucide-react';
import type { VehicleWithStatus, VehicleStatus } from '@/types';

const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      patente
      marca
      modelo
      year
      kmRecorrido
      fuelEfficiency
      batteryHealth
      engineHealth
      status
      driver {
        id
        username
      }
    }
  }
`;



export function FleetPage() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => graphqlClient.request(GET_VEHICLES),
    });

    const [vehicles, setVehicles] = useState<VehicleWithStatus[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithStatus[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithStatus | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (data?.vehicles) {
            const mappedVehicles: VehicleWithStatus[] = data.vehicles.map((v: any) => ({
                id: v.id,
                patente: v.patente,
                marca: v.marca,
                modelo: v.modelo,
                year: v.year,
                kmRecorrido: v.kmRecorrido || 0,
                fuelEfficiency: v.fuelEfficiency,
                batteryHealth: v.batteryHealth,
                engineHealth: v.engineHealth,
                status: v.status,
                driver: v.driver,
            }));
            setVehicles(mappedVehicles);
        }
    }, [data]);

    useEffect(() => {
        let filtered = vehicles;

        if (searchTerm) {
            filtered = filtered.filter(
                (v) =>
                    v.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.driver?.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((v) => v.status === statusFilter);
        }

        setFilteredVehicles(filtered);
    }, [vehicles, searchTerm, statusFilter]);

    const handleVehicleClick = (vehicle: VehicleWithStatus) => {
        setSelectedVehicle(vehicle);
        setDialogOpen(true);
    };

    const stats = {
        total: vehicles.length,
        operational: vehicles.filter(v => v.status === 'OPERATIONAL').length,
        pending: vehicles.filter(v => v.status === 'PENDING_REVIEW').length,
        maintenance: vehicles.filter(v => v.status === 'IN_MAINTENANCE').length,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando vehículos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                    <p className="text-red-500 mb-2 font-semibold">Error al cargar vehículos</p>
                    <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Car className="h-7 w-7 text-blue-500" />
                    Flota de Vehículos
                </h1>
                <p className="text-muted-foreground mt-1">
                    Gestiona y monitorea todos los vehículos de la empresa
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20 hover:shadow-md transition-shadow">
                    <p className="text-xs text-muted-foreground">Operativos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
                </div>
                <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 hover:shadow-md transition-shadow">
                    <p className="text-xs text-muted-foreground">En Revisión</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20 hover:shadow-md transition-shadow">
                    <p className="text-xs text-muted-foreground">Mantención</p>
                    <p className="text-2xl font-bold text-red-600">{stats.maintenance}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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
                    <SelectTrigger className="w-full sm:w-[220px]">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="OPERATIONAL">✅ Operativo</SelectItem>
                        <SelectItem value="PENDING_REVIEW">⚠️ Revisión Pendiente</SelectItem>
                        <SelectItem value="IN_MAINTENANCE">🔧 En Mantención</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            {searchTerm || statusFilter !== 'all' ? (
                <p className="text-sm text-muted-foreground">
                    Mostrando <strong className="text-foreground">{filteredVehicles.length}</strong> de <strong className="text-foreground">{vehicles.length}</strong> vehículos
                </p>
            ) : null}

            {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onClick={() => handleVehicleClick(vehicle)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Car className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold">No se encontraron vehículos</h3>
                    <p className="text-muted-foreground mt-1">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}

            <VehicleDetailDialog
                vehicle={selectedVehicle}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
}
