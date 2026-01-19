import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Car, Fuel, Clock, Wrench, TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalVehicles
      avgFuelEfficiency
      avgTripTime
      vehiclesInMaintenance
      fuelEfficiencyLast6Months {
        month
        value
      }
      avgTripTimeLastWeek {
        day
        value
      }
      maintenanceLast4Weeks {
        week
        value
      }
    }
  }
`;

export function DashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => graphqlClient.request(GET_DASHBOARD_STATS),
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    const stats = data?.dashboardStats || {
        totalVehicles: 0,
        avgFuelEfficiency: 0,
        avgTripTime: 0,
        vehiclesInMaintenance: 0,
        fuelEfficiencyLast6Months: [],
        avgTripTimeLastWeek: [],
        maintenanceLast4Weeks: [],
    };

    // config de grafos
    const fuelChartData = {
        labels: stats.fuelEfficiencyLast6Months.map((d: any) => d.month),
        datasets: [{
            label: 'L/100km',
            data: stats.fuelEfficiencyLast6Months.map((d: any) => d.value),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    };

    const tripTimeChartData = {
        labels: stats.avgTripTimeLastWeek.map((d: any) => d.day),
        datasets: [{
            label: 'Minutos',
            data: stats.avgTripTimeLastWeek.map((d: any) => d.value),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    };

    const maintenanceChartData = {
        labels: stats.maintenanceLast4Weeks.map((d: any) => d.week),
        datasets: [{
            label: 'Vehículos',
            data: stats.maintenanceLast4Weeks.map((d: any) => d.value),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Vista general de la flota y métricas en tiempo real
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Vehículos"
                    value={stats.totalVehicles}
                    icon={<Car className="h-6 w-6" />}
                    trend="+0%"
                    trendUp={true}
                    color="blue"
                />
                <StatCard
                    title="Eficiencia Combustible"
                    value={`${stats.avgFuelEfficiency.toFixed(1)} L/100km`}
                    icon={<Fuel className="h-6 w-6" />}
                    trend="+5.2%"
                    trendUp={true}
                    color="green"
                />
                <StatCard
                    title="Tiempo Promedio Ruta"
                    value={`${stats.avgTripTime} min`}
                    icon={<Clock className="h-6 w-6" />}
                    trend="-2.1%"
                    trendUp={false}
                    color="purple"
                />
                <StatCard
                    title="En Mantención"
                    value={stats.vehiclesInMaintenance}
                    icon={<Wrench className="h-6 w-6" />}
                    trend="0%"
                    trendUp={false}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border bg-card shadow-sm">
                    <h3 className="text-lg font-semibold mb-1">Eficiencia de Combustible</h3>
                    <p className="text-sm text-muted-foreground mb-4">Últimos 6 meses</p>
                    <div className="h-[250px]">
                        <Line data={fuelChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="p-6 rounded-lg border bg-card shadow-sm">
                    <h3 className="text-lg font-semibold mb-1">Tiempo Promedio de Ruta</h3>
                    <p className="text-sm text-muted-foreground mb-4">Última semana</p>
                    <div className="h-[250px]">
                        <Line data={tripTimeChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="p-6 rounded-lg border bg-card shadow-sm">
                    <h3 className="text-lg font-semibold mb-1">Vehículos en Taller</h3>
                    <p className="text-sm text-muted-foreground mb-4">Últimas 4 semanas</p>
                    <div className="h-[250px]">
                        <Line data={maintenanceChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="p-6 rounded-lg border bg-card shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Resumen Rápido</h3>
                    <div className="space-y-4">
                        <QuickStat
                            label="Km totales recorridos"
                            value={`${(stats.totalVehicles * 75000).toLocaleString()} km`}
                            color="blue"
                        />
                        <QuickStat
                            label="Promedio km por vehículo"
                            value={`${(75000).toLocaleString()} km`}
                            color="green"
                        />
                        <QuickStat
                            label="Salud promedio batería"
                            value="85.2%"
                            color="yellow"
                        />
                        <QuickStat
                            label="Salud promedio motor"
                            value="78.5%"
                            color="purple"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, trendUp, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20',
        green: 'bg-green-50 text-green-600 dark:bg-green-950/20',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20',
        red: 'bg-red-50 text-red-600 dark:bg-red-950/20',
    };

    return (
        <div className="p-5 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {trend}
                </div>
            </div>
            <h3 className="text-sm text-muted-foreground font-medium">{title}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}

function QuickStat({ label, value, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${colorClasses[color]}`}></div>
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <span className="text-sm font-semibold">{value}</span>
        </div>
    );
}
