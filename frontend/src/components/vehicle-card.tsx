import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { Car } from 'lucide-react';
import type { VehicleWithStatus } from '@/types';

interface VehicleCardProps {
    vehicle: VehicleWithStatus;
    onClick?: () => void;
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group"
            onClick={onClick}
        >
            <CardHeader className="pb-2">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Placeholder for vehicle image */}
                    <Car className="w-16 h-16 text-slate-400 group-hover:scale-110 transition-transform" />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{vehicle.patente}</h3>
                    <StatusBadge status={vehicle.status} />
                </div>
                <p className="text-muted-foreground text-sm">
                    {vehicle.marca} {vehicle.modelo}
                </p>
                {vehicle.year && (
                    <p className="text-muted-foreground text-xs">Año: {vehicle.year}</p>
                )}
            </CardContent>
            <CardFooter className="pt-0">
                <div className="w-full flex justify-between text-xs text-muted-foreground">
                    <span>{vehicle.kmRecorrido.toLocaleString()} km</span>
                    {vehicle.driver && (
                        <span>Conductor: {vehicle.driver.username}</span>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
