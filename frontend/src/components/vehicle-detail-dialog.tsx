import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/status-badge';
import { Car, Mail, Send, Battery, Gauge, Wrench } from 'lucide-react';
import type { VehicleWithStatus, VehicleAction } from '@/types';
import { VEHICLE_ACTIONS } from '@/types';
import { sendQRCodeByEmail, getQRCodeUrl } from '@/services/qr-api';

interface VehicleDetailDialogProps {
    vehicle: VehicleWithStatus | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VehicleDetailDialog({ vehicle, open, onOpenChange }: VehicleDetailDialogProps) {
    const [email, setEmail] = useState('');
    const [action, setAction] = useState<VehicleAction | ''>('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    if (!vehicle) return null;

    const handleSendQR = async () => {
        if (!email || !action) {
            setMessage({ type: 'error', text: 'Por favor complete todos los campos' });
            return;
        }

        setSending(true);
        setMessage(null);

        try {
            const result = await sendQRCodeByEmail(vehicle.id, email, action);
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                setEmail('');
                setAction('');
            } else {
                setMessage({ type: 'error', text: 'Error al enviar el QR' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        {vehicle.marca} {vehicle.modelo} - {vehicle.patente}
                    </DialogTitle>
                    <DialogDescription>
                        Información detallada del vehículo
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Image */}
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
                        <Car className="w-24 h-24 text-slate-400" />
                    </div>

                    {/* Vehicle Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Estado:</span>
                            <StatusBadge status={vehicle.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="space-y-2">
                                <p><span className="font-medium">Patente:</span> {vehicle.patente}</p>
                                <p><span className="font-medium">Marca:</span> {vehicle.marca}</p>
                                <p><span className="font-medium">Modelo:</span> {vehicle.modelo}</p>
                                <p><span className="font-medium">Año:</span> {vehicle.year || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <p><span className="font-medium">KM:</span> {vehicle.kmRecorrido.toLocaleString()}</p>
                                <p><span className="font-medium">Odómetro:</span> {vehicle.odometerReading?.toLocaleString() || 'N/A'}</p>
                                <p><span className="font-medium">Conductor:</span> {vehicle.driver?.username || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Health Indicators */}
                        <div className="pt-2 border-t">
                            <p className="font-medium mb-2 text-sm">Indicadores de Salud:</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex items-center gap-1 text-xs">
                                    <Battery className="w-4 h-4 text-green-500" />
                                    <span>Batería: {vehicle.batteryHealth ? `${vehicle.batteryHealth}%` : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Wrench className="w-4 h-4 text-blue-500" />
                                    <span>Motor: {vehicle.engineHealth ? `${vehicle.engineHealth}%` : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Gauge className="w-4 h-4 text-orange-500" />
                                    <span>Efic.: {vehicle.fuelEfficiency ? `${vehicle.fuelEfficiency} km/l` : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Preview */}
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-4">
                        <img
                            src={getQRCodeUrl(vehicle.id)}
                            alt="QR Code del vehículo"
                            className="w-24 h-24 border rounded bg-white"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">Código QR del Vehículo</p>
                            <p>Escanea para ver información completa</p>
                        </div>
                    </div>
                </div>

                {/* Email QR Section */}
                <div className="mt-4 p-4 border rounded-lg space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Enviar QR por Email
                    </h4>

                    <Select value={action} onValueChange={(value) => setAction(value as VehicleAction)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar acción" />
                        </SelectTrigger>
                        <SelectContent>
                            {VEHICLE_ACTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleSendQR} disabled={sending}>
                            <Send className="w-4 h-4 mr-2" />
                            {sending ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </div>

                    {message && (
                        <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
