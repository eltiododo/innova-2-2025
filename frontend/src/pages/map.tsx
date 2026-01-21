import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    MapIcon,
    Navigation,
    Truck,
    Route,
    RefreshCw,
    Layers,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { optimizeRoutes } from '@/services/ml-api';
import { getTravelLogs } from '@/services/travel-logs';
import type { RouteLocation, TravelLog } from '@/types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const sampleLocations: RouteLocation[] = [
    { lat: -33.4489, long: -70.6693 }, // Plaza de Armas
    { lat: -33.4372, long: -70.6506 }, // Providencia
    { lat: -33.4052, long: -70.5751 }, // Las Condes
    { lat: -33.4569, long: -70.5987 }, // Ñuñoa
    { lat: -33.5138, long: -70.6052 }, // La Florida
    { lat: -33.4722, long: -70.6419 }, // San Miguel
    { lat: -33.4288, long: -70.6144 }, // Vitacura
    { lat: -33.4915, long: -70.6581 }, // San Joaquín
];

const routeColors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#22c55e', // green
    '#f97316', // orange
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#eab308', // yellow
];

type ViewMode = 'vehicles' | 'routes' | 'heatmap';

const SANTIAGO_BOUNDS = {
    minLat: -34.2,
    maxLat: -33.0,
    minLong: -71.5,
    maxLong: -70.3,
};

const isWithinBounds = (lat: number, long: number) =>
    lat >= SANTIAGO_BOUNDS.minLat &&
    lat <= SANTIAGO_BOUNDS.maxLat &&
    long >= SANTIAGO_BOUNDS.minLong &&
    long <= SANTIAGO_BOUNDS.maxLong;

export function MapPage() {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markerLayerRef = useRef<L.LayerGroup | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('vehicles');
    const [numVehicles, setNumVehicles] = useState('3');
    const [routes, setRoutes] = useState<Record<string, [number, number][]>>({});
    const [loading, setLoading] = useState(false);
    const [routeLayers, setRouteLayers] = useState<L.LayerGroup | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { data: travelLogs = [], isLoading: travelLoading } = useQuery({
        queryKey: ['travelLogs'],
        queryFn: getTravelLogs,
    });

    const filteredTravelLogs = useMemo(
        () =>
            travelLogs.filter((log) => {
                const startOk = isWithinBounds(log.startPosition.x, log.startPosition.y);
                const endOk = log.endPosition
                    ? isWithinBounds(log.endPosition.x, log.endPosition.y)
                    : false;
                return startOk || endOk;
            }),
        [travelLogs]
    );

    const routeLocations = useMemo<RouteLocation[]>(() => {
        if (filteredTravelLogs.length === 0) {
            return sampleLocations;
        }
        return filteredTravelLogs
            .map((log) => ({
                lat: log.startPosition.x,
                long: log.startPosition.y,
            }))
            .filter((loc) => Number.isFinite(loc.lat) && Number.isFinite(loc.long));
    }, [filteredTravelLogs]);

    const mapMarkers = useMemo(() => {
        if (filteredTravelLogs.length === 0) {
            return sampleLocations.map((loc, index) => ({
                id: `sample-${index}`,
                label: `Punto de entrega ${index + 1}`,
                lat: loc.lat,
                long: loc.long,
            }));
        }
        return filteredTravelLogs.map((log: TravelLog) => {
            const position =
                log.state === 'ARRIVED' && log.endPosition
                    ? { lat: log.endPosition.x, long: log.endPosition.y }
                    : { lat: log.startPosition.x, long: log.startPosition.y };
            return {
                id: log.id,
                label: `Vehículo ${log.vehicle?.patente ?? log.vehicle?.id ?? log.id}`,
                lat: position.lat,
                long: position.long,
            };
        });
    }, [filteredTravelLogs]);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            try {
                mapRef.current = L.map(mapContainerRef.current).setView([-33.4489, -70.6693], 12);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 19,
                }).addTo(mapRef.current);

                setError(null);
            } catch (err) {
                console.error('Error initializing map:', err);
                setError('Error al inicializar el mapa');
            }
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        if (markerLayerRef.current) {
            markerLayerRef.current.clearLayers();
        }

        const newLayer = L.layerGroup().addTo(mapRef.current);

        if (viewMode === 'vehicles') {
            mapMarkers.forEach((marker) => {
                if (!Number.isFinite(marker.lat) || !Number.isFinite(marker.long)) return;
                L.marker([marker.lat, marker.long])
                    .addTo(newLayer)
                    .bindPopup(
                        `<b>${marker.label}</b><br>Lat: ${marker.lat.toFixed(4)}<br>Long: ${marker.long.toFixed(4)}`
                    );
            });
        }

        markerLayerRef.current = newLayer;
    }, [mapMarkers, viewMode]);

    const handleOptimizeRoutes = async () => {
        setLoading(true);
        setError(null);
        try {
            if (routeLocations.length === 0) {
                setError('No hay ubicaciones disponibles para optimizar rutas.');
                return;
            }
            const result = await optimizeRoutes({
                locations: routeLocations,
                n_vehicles: parseInt(numVehicles),
            });
            setRoutes(result.routes);
            drawRoutes(result.routes);
        } catch (error) {
            console.error('Error optimizing routes:', error);
            setError('Error al optimizar rutas. Usando rutas de demostración.');
            const mockRoutes = generateMockRoutes(parseInt(numVehicles), routeLocations);
            setRoutes(mockRoutes);
            drawRoutes(mockRoutes);
        } finally {
            setLoading(false);
        }
    };

    const generateMockRoutes = (n: number, locations: RouteLocation[]): Record<string, [number, number][]> => {
        if (locations.length === 0) return {};
        const result: Record<string, [number, number][]> = {};
        const locationsPerVehicle = Math.ceil(locations.length / n);

        for (let i = 0; i < n; i++) {
            const start = i * locationsPerVehicle;
            const end = Math.min(start + locationsPerVehicle, locations.length);
            const vehicleLocations = locations.slice(start, end);

            result[i.toString()] = [
                [locations[0].lat, locations[0].long],
                ...vehicleLocations.map(l => [l.lat, l.long] as [number, number]),
                [locations[0].lat, locations[0].long],
            ];
        }

        return result;
    };

    const drawRoutes = (routeData: Record<string, [number, number][]>) => {
        if (!mapRef.current) return;

        if (routeLayers) {
            routeLayers.clearLayers();
        }

        const newLayerGroup = L.layerGroup().addTo(mapRef.current);

        Object.entries(routeData).forEach(([vehicleId, coords], index) => {
            const color = routeColors[index % routeColors.length];


            const polyline = L.polyline(coords, {
                color,
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 5',
            }).addTo(newLayerGroup);

            coords.forEach((coord, pointIndex) => {
                if (pointIndex === 0) {
                    L.circleMarker(coord, {
                        radius: 10,
                        fillColor: '#000',
                        color: '#fff',
                        weight: 2,
                        fillOpacity: 0.9,
                    })
                        .addTo(newLayerGroup)
                        .bindPopup('<b>Depósito Central</b>');
                } else if (pointIndex === coords.length - 1) {
                } else {
                    L.circleMarker(coord, {
                        radius: 8,
                        fillColor: color,
                        color: '#fff',
                        weight: 2,
                        fillOpacity: 0.9,
                    })
                        .addTo(newLayerGroup)
                        .bindPopup(`<b>Vehículo ${parseInt(vehicleId) + 1}</b><br>Parada ${pointIndex}`);
                }
            });

            if (coords.length > 0) {
                mapRef.current?.fitBounds(polyline.getBounds().pad(0.1));
            }
        });

        setRouteLayers(newLayerGroup);
    };

    const clearRoutes = () => {
        if (routeLayers) {
            routeLayers.clearLayers();
            setRoutes({});
        }
    };

    const centerMap = () => {
        mapRef.current?.setView([-33.4489, -70.6693], 12);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <MapIcon className="h-7 w-7 text-blue-500" />
                    Mapa de Rutas
                </h1>
                <p className="text-muted-foreground mt-1">
                    Visualiza y optimiza las rutas de tus vehículos en tiempo real
                </p>
            </div>

            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            {travelLogs.length > 0 && filteredTravelLogs.length === 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                Las coordenadas de la DB no están en Santiago. Usando datos demo locales.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {travelLoading && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">Cargando ubicaciones desde la base de datos...</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-4">
                <Card className="flex-1 min-w-[280px]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Modo de Vista
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'vehicles' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('vehicles')}
                                className="flex-1"
                            >
                                <Truck className="w-4 h-4 mr-1" />
                                Puntos
                            </Button>
                            <Button
                                variant={viewMode === 'routes' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('routes')}
                                className="flex-1"
                            >
                                <Route className="w-4 h-4 mr-1" />
                                Rutas
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 min-w-[280px]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Navigation className="w-4 h-4" />
                            Optimización de Rutas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex gap-2">
                            <Select value={numVehicles} onValueChange={setNumVehicles}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Vehículos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 Vehículos</SelectItem>
                                    <SelectItem value="3">3 Vehículos</SelectItem>
                                    <SelectItem value="4">4 Vehículos</SelectItem>
                                    <SelectItem value="5">5 Vehículos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleOptimizeRoutes}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Optimizando
                                    </>
                                ) : (
                                    <>
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Optimizar
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 min-w-[280px]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <MapIcon className="w-4 h-4" />
                            Acciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearRoutes}
                                className="flex-1"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Limpiar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={centerMap}
                                className="flex-1"
                            >
                                <Navigation className="w-4 h-4 mr-1" />
                                Centrar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0 h-[600px]">
                    <div
                        ref={mapContainerRef}
                        className="w-full h-full"
                        style={{ minHeight: '600px' }}
                    />
                </CardContent>
            </Card>

            {Object.keys(routes).length > 0 && (
                <Card className="border-t-4 border-t-blue-500">
                    <CardContent className="py-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <span className="text-sm font-semibold">Rutas Optimizadas:</span>
                            {Object.keys(routes).map((vehicleId, index) => (
                                <div
                                    key={vehicleId}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                                    style={{
                                        borderColor: routeColors[index % routeColors.length],
                                        backgroundColor: `${routeColors[index % routeColors.length]}15`
                                    }}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: routeColors[index % routeColors.length] }}
                                    />
                                    <Truck className="w-4 h-4" />
                                    <span className="text-sm font-medium">Vehículo {parseInt(vehicleId) + 1}</span>
                                </div>
                            ))}
                            <span className="text-xs text-muted-foreground ml-auto">
                                📍 {routeLocations.length} puntos de entrega
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
