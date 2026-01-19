import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Fuel,
    Clock,
    Wrench,
    TrendingUp,
    TrendingDown,
    Car,
    AlertTriangle,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// Mock data for charts
const fuelEfficiencyData = [
    { month: 'Ene', efficiency: 12.5 },
    { month: 'Feb', efficiency: 12.8 },
    { month: 'Mar', efficiency: 13.1 },
    { month: 'Abr', efficiency: 12.9 },
    { month: 'May', efficiency: 13.4 },
    { month: 'Jun', efficiency: 13.2 },
    { month: 'Jul', efficiency: 13.8 },
    { month: 'Ago', efficiency: 14.1 },
    { month: 'Sep', efficiency: 13.9 },
    { month: 'Oct', efficiency: 14.3 },
    { month: 'Nov', efficiency: 14.5 },
    { month: 'Dic', efficiency: 14.2 },
];

const routeTimeData = [
    { day: 'Lun', tiempo: 45 },
    { day: 'Mar', tiempo: 52 },
    { day: 'Mié', tiempo: 48 },
    { day: 'Jue', tiempo: 55 },
    { day: 'Vie', tiempo: 62 },
    { day: 'Sáb', tiempo: 38 },
    { day: 'Dom', tiempo: 32 },
];

const maintenanceData = [
    { name: 'Operativos', value: 42, color: '#22c55e' },
    { name: 'En Revisión', value: 8, color: '#eab308' },
    { name: 'En Taller', value: 5, color: '#ef4444' },
];

const recentMaintenance = [
    { patente: 'ABCD-12', status: 'En taller', days: 2 },
    { patente: 'EFGH-34', status: 'En taller', days: 1 },
    { patente: 'IJKL-56', status: 'Programado', days: 0 },
    { patente: 'MNOP-78', status: 'En taller', days: 3 },
    { patente: 'QRST-90', status: 'Programado', days: 1 },
];

export function DashboardPage() {
    const [stats] = useState({
        totalVehicles: 55,
        avgFuelEfficiency: 14.2,
        avgRouteTime: 48,
        inMaintenance: 5,
    });

    useEffect(() => {
        // TODO: Fetch real data from API
        // getVehicles().then(...)
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Vista general del rendimiento de tu flota
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Vehículos
                        </CardTitle>
                        <Car className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.totalVehicles}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
                            +3 este mes
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Eficiencia Combustible
                        </CardTitle>
                        <Fuel className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.avgFuelEfficiency} km/l</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
                            +8% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-orange-200/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tiempo Promedio Ruta
                        </CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{stats.avgRouteTime} min</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <TrendingDown className="w-3 h-3 inline mr-1 text-green-500" />
                            -5 min vs ayer
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border-red-200/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            En Mantención
                        </CardTitle>
                        <Wrench className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{stats.inMaintenance}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <AlertTriangle className="w-3 h-3 inline mr-1 text-yellow-500" />
                            2 urgentes
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Fuel Efficiency Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Fuel className="h-5 w-5 text-green-500" />
                            Eficiencia de Combustible
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={fuelEfficiencyData}>
                                    <defs>
                                        <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" domain={[10, 16]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                        formatter={(value) => [`${value} km/l`, 'Eficiencia']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="efficiency"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorEfficiency)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-blue-500" />
                            Estado de Flota
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={maintenanceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {maintenanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            {maintenanceData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span>{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Second Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Route Time Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            Tiempo Promedio de Ruta (últimos 7 días)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={routeTimeData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="day" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                        formatter={(value) => [`${value} min`, 'Tiempo']}
                                    />
                                    <Bar dataKey="tiempo" fill="#f97316" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Maintenance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-red-500" />
                            Vehículos en Mantención
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentMaintenance.map((vehicle, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                            <Car className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{vehicle.patente}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {vehicle.days} días en taller
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={vehicle.status === 'En taller' ? 'destructive' : 'secondary'}>
                                        {vehicle.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
