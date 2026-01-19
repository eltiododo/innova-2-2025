import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Car, Gauge, Battery, User } from 'lucide-react';
import type { VehicleWithStatus } from '@/types';

interface VehicleCardProps {
    vehicle: VehicleWithStatus;
    onClick?: () => void;
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group overflow-hidden"
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="aspect-video bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-lg flex items-center justify-center overflow-hidden relative">
                    <Car className="w-20 h-20 text-slate-400 dark:text-slate-600 group-hover:scale-110 transition-transform duration-300" />

                    <div className="absolute top-2 right-2">
                        <StatusBadge status={vehicle.status} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <h3 className="font-bold text-xl">{vehicle.patente}</h3>
                    <p className="text-muted-foreground text-sm">
                        {vehicle.marca} {vehicle.modelo}
                    </p>
                    {vehicle.year && (
                        <p className="text-xs text-muted-foreground">Año {vehicle.year}</p>
                    )}
                </div>

                <div className="flex gap-2 flex-wrap">
                    {vehicle.batteryHealth && (
                        <Badge variant="outline" className="text-xs gap-1">
                            <Battery className="w-3 h-3 text-green-500" />
                            {vehicle.batteryHealth}%
                        </Badge>
                    )}
                    {vehicle.fuelEfficiency && (
                        <Badge variant="outline" className="text-xs gap-1">
                            <Gauge className="w-3 h-3 text-orange-500" />
                            {vehicle.fuelEfficiency} km/l
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0 border-t flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">{vehicle.kmRecorrido.toLocaleString()} km</span>
                {vehicle.driver && (
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {vehicle.driver.username}
                    </span>
                )}
            </CardFooter>
        </Card>
    );
}
