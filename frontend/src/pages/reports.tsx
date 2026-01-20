import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileText, Search, Battery, Wrench, Gauge } from 'lucide-react';
import type { VehicleWithStatus, VehicleStatus } from '@/types';

const mockVehicles: VehicleWithStatus[] = [
    { id: '1', patente: 'ABCD-12', marca: 'Toyota', modelo: 'Hilux', kmRecorrido: 45000, year: 2022, batteryHealth: 95, engineHealth: 88, fuelEfficiency: 12.5, driver: { id: '1', username: 'Juan Pérez', email: '', phone: '', role: 'DRIVER' }, status: 'OPERATIONAL' },
    { id: '2', patente: 'EFGH-34', marca: 'Ford', modelo: 'Ranger', kmRecorrido: 62000, year: 2021, batteryHealth: 82, engineHealth: 75, fuelEfficiency: 11.8, driver: { id: '2', username: 'María García', email: '', phone: '', role: 'DRIVER' }, status: 'PENDING_REVIEW' },
    { id: '3', patente: 'IJKL-56', marca: 'Chevrolet', modelo: 'D-Max', kmRecorrido: 78000, year: 2020, batteryHealth: 65, engineHealth: 60, fuelEfficiency: 10.2, driver: { id: '3', username: 'Carlos López', email: '', phone: '', role: 'DRIVER' }, status: 'IN_MAINTENANCE' },
    { id: '4', patente: 'MNOP-78', marca: 'Nissan', modelo: 'Navara', kmRecorrido: 35000, year: 2023, batteryHealth: 98, engineHealth: 95, fuelEfficiency: 13.5, driver: { id: '4', username: 'Ana Martínez', email: '', phone: '', role: 'DRIVER' }, status: 'OPERATIONAL' },
    { id: '5', patente: 'QRST-90', marca: 'Mitsubishi', modelo: 'L200', kmRecorrido: 52000, year: 2021, batteryHealth: 88, engineHealth: 82, fuelEfficiency: 11.2, driver: { id: '5', username: 'Pedro Sánchez', email: '', phone: '', role: 'DRIVER' }, status: 'OPERATIONAL' },
    { id: '6', patente: 'UVWX-11', marca: 'Isuzu', modelo: 'D-Max', kmRecorrido: 41000, year: 2022, batteryHealth: 92, engineHealth: 90, fuelEfficiency: 12.8, driver: { id: '6', username: 'Laura Torres', email: '', phone: '', role: 'DRIVER' }, status: 'PENDING_REVIEW' },
    { id: '7', patente: 'YZAB-22', marca: 'Toyota', modelo: 'Tacoma', kmRecorrido: 28000, year: 2023, batteryHealth: 99, engineHealth: 97, fuelEfficiency: 14.1, driver: { id: '7', username: 'Diego Ruiz', email: '', phone: '', role: 'DRIVER' }, status: 'OPERATIONAL' },
    { id: '8', patente: 'CDEF-33', marca: 'Ford', modelo: 'F-150', kmRecorrido: 95000, year: 2019, batteryHealth: 55, engineHealth: 50, fuelEfficiency: 9.5, driver: { id: '8', username: 'Sofía Morales', email: '', phone: '', role: 'DRIVER' }, status: 'IN_MAINTENANCE' },
];

const statusConfig: Record<VehicleStatus, { label: string; className: string }> = {
    OPERATIONAL: { label: 'Operativo', className: 'bg-green-100 text-green-800 border-green-200' },
    PENDING_REVIEW: { label: 'Revisión Pendiente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    IN_MAINTENANCE: { label: 'En Mantención', className: 'bg-red-100 text-red-800 border-red-200' },
};

function getHealthColor(health: number | undefined) {
    if (!health) return 'text-muted-foreground';
    if (health >= 80) return 'text-green-600 dark:text-green-500';
    if (health >= 60) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600 dark:text-red-500';
}

function getHealthBadge(health: number | undefined) {
    if (!health) return <Badge variant="outline">N/A</Badge>;
    if (health >= 80) return <Badge className="bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400 border-green-200">{health}%</Badge>;
    if (health >= 60) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400 border-yellow-200">{health}%</Badge>;
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border-red-200">{health}%</Badge>;
}

export function ReportsPage() {
    const [vehicles] = useState<VehicleWithStatus[]>(mockVehicles);
    const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithStatus[]>(mockVehicles);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');

    useEffect(() => {
        let filtered = vehicles;

        if (searchTerm) {
            filtered = filtered.filter(
                (v) =>
                    v.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.driver?.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((v) => v.status === statusFilter);
        }

        setFilteredVehicles(filtered);
    }, [vehicles, searchTerm, statusFilter]);

    const stats = {
        operational: vehicles.filter((v) => v.status === 'OPERATIONAL').length,
        pending: vehicles.filter((v) => v.status === 'PENDING_REVIEW').length,
        maintenance: vehicles.filter((v) => v.status === 'IN_MAINTENANCE').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <FileText className="h-7 w-7 text-indigo-500" />
                    Reportes y Estado
                </h1>
                <p className="text-muted-foreground mt-1">
                    Vista general del estado de todos los vehículos
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Operativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.operational}</div>
                        <p className="text-xs text-muted-foreground">
                            {((stats.operational / vehicles.length) * 100).toFixed(0)}% de la flota
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Revisión Pendiente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Requieren atención pronto</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">En Mantención</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{stats.maintenance}</div>
                        <p className="text-xs text-muted-foreground">En taller actualmente</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por patente, marca o conductor..."
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
                        <SelectItem value="OPERATIONAL">Operativo</SelectItem>
                        <SelectItem value="PENDING_REVIEW">Revisión Pendiente</SelectItem>
                        <SelectItem value="IN_MAINTENANCE">En Mantención</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {searchTerm || statusFilter !== 'all' ? (
                <p className="text-sm text-muted-foreground">
                    Mostrando <strong className="text-foreground">{filteredVehicles.length}</strong> de <strong className="text-foreground">{vehicles.length}</strong> vehículos
                </p>
            ) : null}

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[200px]">Vehículo</TableHead>
                                    <TableHead>Conductor</TableHead>
                                    <TableHead className="text-center">Kilometraje</TableHead>
                                    <TableHead className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Battery className="w-3 h-3" />
                                            <span className="hidden sm:inline">Batería</span>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Wrench className="w-3 h-3" />
                                            <span className="hidden sm:inline">Motor</span>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Gauge className="w-3 h-3" />
                                            <span className="hidden sm:inline">Eficiencia</span>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVehicles.map((vehicle) => (
                                    <TableRow
                                        key={vehicle.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <TableCell>
                                            <div>
                                                <p className="font-semibold text-sm">{vehicle.patente}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {vehicle.marca} {vehicle.modelo}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{vehicle.driver?.username || '-'}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-sm font-medium">{vehicle.kmRecorrido.toLocaleString()}</span>
                                            <span className="text-xs text-muted-foreground ml-1">km</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getHealthBadge(vehicle.batteryHealth)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getHealthBadge(vehicle.engineHealth)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-sm font-medium">
                                                {vehicle.fuelEfficiency ? `${vehicle.fuelEfficiency}` : '-'}
                                            </span>
                                            {vehicle.fuelEfficiency && (
                                                <span className="text-xs text-muted-foreground ml-1">km/l</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`${statusConfig[vehicle.status].className} border font-medium`}>
                                                {statusConfig[vehicle.status].label}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
