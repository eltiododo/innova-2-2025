import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Map as MapIcon,
    Navigation,
    Layers,
    Truck,
    MapPin,
    Route,
    Crosshair,
    RefreshCw
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { optimizeRoutes } from '@/services/ml-api';
import type { RouteLocation } from '@/types';

// Fix for default marker icons in Leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sample delivery locations in Santiago, Chile
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

// Route colors for different vehicles
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

export function MapPage() {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('vehicles');
    const [numVehicles, setNumVehicles] = useState('3');
    const [routes, setRoutes] = useState<Record<string, [number, number][]>>({});
    const [loading, setLoading] = useState(false);
    const [routeLayers, setRouteLayers] = useState<L.LayerGroup | null>(null);

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([-33.4489, -70.6693], 12);

            // Add tile layer with dark/light mode support
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19,
            }).addTo(mapRef.current);

            // Add sample location markers
            sampleLocations.forEach((loc, index) => {
                if (mapRef.current) {
                    L.marker([loc.lat, loc.long])
                        .addTo(mapRef.current)
                        .bindPopup(`<b>Punto de entrega ${index + 1}</b><br>Lat: ${loc.lat.toFixed(4)}<br>Long: ${loc.long.toFixed(4)}`);
                }
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Generate optimized routes
    const handleOptimizeRoutes = async () => {
        setLoading(true);
        try {
            const result = await optimizeRoutes({
                locations: sampleLocations,
                n_vehicles: parseInt(numVehicles),
            });
            setRoutes(result.routes);
            drawRoutes(result.routes);
        } catch (error) {
            console.error('Error optimizing routes:', error);
            // Generate mock routes for demo
            const mockRoutes = generateMockRoutes(parseInt(numVehicles));
            setRoutes(mockRoutes);
            drawRoutes(mockRoutes);
        } finally {
            setLoading(false);
        }
    };

    // Generate mock routes for demo purposes
    const generateMockRoutes = (n: number): Record<string, [number, number][]> => {
        const result: Record<string, [number, number][]> = {};
        const locationsPerVehicle = Math.ceil(sampleLocations.length / n);

        for (let i = 0; i < n; i++) {
            const start = i * locationsPerVehicle;
            const end = Math.min(start + locationsPerVehicle, sampleLocations.length);
            const vehicleLocations = sampleLocations.slice(start, end);

            // Add depot (Plaza de Armas) at start and end
            result[i.toString()] = [
                [sampleLocations[0].lat, sampleLocations[0].long],
                ...vehicleLocations.map(l => [l.lat, l.long] as [number, number]),
                [sampleLocations[0].lat, sampleLocations[0].long],
            ];
        }

        return result;
    };

    // Draw routes on map
    const drawRoutes = (routeData: Record<string, [number, number][]>) => {
        if (!mapRef.current) return;

        // Clear existing routes
        if (routeLayers) {
            routeLayers.clearLayers();
        }

        const newLayerGroup = L.layerGroup().addTo(mapRef.current);

        Object.entries(routeData).forEach(([vehicleId, coords], index) => {
            const color = routeColors[index % routeColors.length];

            // Create polyline for route
            const polyline = L.polyline(coords, {
                color,
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 5',
            }).addTo(newLayerGroup);

            // Add route markers
            coords.forEach((coord, pointIndex) => {
                if (pointIndex === 0) {
                    // Depot marker
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
                    // Skip last (same as first)
                } else {
                    // Stop marker
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

            // Fit bounds to show all routes
            if (coords.length > 0) {
                mapRef.current?.fitBounds(polyline.getBounds().pad(0.1));
            }
        });

        setRouteLayers(newLayerGroup);
    };

    // Clear routes
    const clearRoutes = () => {
        if (routeLayers) {
            routeLayers.clearLayers();
            setRoutes({});
        }
    };

    // Center on Santiago
    const centerMap = () => {
        mapRef.current?.setView([-33.4489, -70.6693], 12);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <MapIcon className="h-8 w-8 text-emerald-500" />
                        Mapa de Flota
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Visualización y optimización de rutas en tiempo real
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4">
                {/* View Mode */}
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
                            >
                                <Truck className="w-4 h-4 mr-1" />
                                Vehículos
                            </Button>
                            <Button
                                variant={viewMode === 'routes' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('routes')}
                            >
                                <Route className="w-4 h-4 mr-1" />
                                Rutas
                            </Button>
                            <Button
                                variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('heatmap')}
                            >
                                <MapPin className="w-4 h-4 mr-1" />
                                Puntos
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Route Optimization */}
                <Card className="flex-1 min-w-[320px]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Navigation className="w-4 h-4" />
                            Optimización de Rutas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex gap-2 items-center">
                            <Select value={numVehicles} onValueChange={setNumVehicles}>
                                <SelectTrigger className="w-[140px]">
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
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Calculando...
                                    </>
                                ) : (
                                    <>
                                        <Route className="w-4 h-4 mr-2" />
                                        Optimizar
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" onClick={clearRoutes}>
                                Limpiar
                            </Button>
                            <Button variant="ghost" size="icon" onClick={centerMap}>
                                <Crosshair className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Route Legend */}
            {Object.keys(routes).length > 0 && (
                <Card>
                    <CardContent className="py-3">
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="text-sm font-medium text-muted-foreground">Rutas:</span>
                            {Object.keys(routes).map((vehicleId, index) => (
                                <Badge
                                    key={vehicleId}
                                    style={{ backgroundColor: routeColors[index % routeColors.length] }}
                                    className="text-white"
                                >
                                    <Truck className="w-3 h-3 mr-1" />
                                    Vehículo {parseInt(vehicleId) + 1}
                                </Badge>
                            ))}
                            <span className="text-xs text-muted-foreground ml-auto">
                                {sampleLocations.length} puntos de entrega
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Map Container */}
            <Card className="flex-1 overflow-hidden">
                <CardContent className="p-0 h-[500px]">
                    <div
                        ref={mapContainerRef}
                        className="w-full h-full"
                        style={{ minHeight: '500px' }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
