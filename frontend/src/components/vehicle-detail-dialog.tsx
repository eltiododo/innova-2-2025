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
import { Badge } from '@/components/ui/badge';
import { Car, Mail, Send, Battery, Gauge, Wrench, User, Calendar, QrCode } from 'lucide-react';
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

    const handleSendEmail = async () => {
        if (!email || !action) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            const vehicleData = `Patente: ${vehicle?.patente}\nMarca: ${vehicle?.marca}\nModelo: ${vehicle?.modelo}\nKM: ${vehicle?.kmRecorrido}`;
            
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/qr/send-email' || 'http://localhost:8080/api/qr/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    action: action,
                    vehicleData: vehicleData,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                alert(`${result.message}`);
                onOpenChange(false);
                setEmail('');
                setAction('');
            } else {
                alert(`${result.message}`);
            }
        } catch (error) {
            alert('Error al enviar el correo. Por favor intenta nuevamente.');
            console.error('Error:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Car className="w-6 h-6" />
                        {vehicle.patente}
                    </DialogTitle>
                    <DialogDescription>
                        {vehicle.marca} {vehicle.modelo} {vehicle.year ? `- ${vehicle.year}` : ''}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
                            <Car className="w-24 h-24 text-slate-400" />
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Estado</span>
                                    <StatusBadge status={vehicle.status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Kilometraje</span>
                                    <span className="font-semibold">{vehicle.kmRecorrido.toLocaleString()} km</span>
                                </div>
                                {vehicle.driver && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Conductor
                                        </span>
                                        <span className="font-semibold text-sm">{vehicle.driver.username}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Battery className="w-4 h-4 text-green-600 dark:text-green-500" />
                                <span className="text-xs text-muted-foreground">Batería</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                                {vehicle.batteryHealth ? `${vehicle.batteryHealth}%` : 'N/A'}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                                <span className="text-xs text-muted-foreground">Motor</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                                {vehicle.engineHealth ? `${vehicle.engineHealth}%` : 'N/A'}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-950/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Gauge className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                                <span className="text-xs text-muted-foreground">Eficiencia</span>
                            </div>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                                {vehicle.fuelEfficiency ? `${vehicle.fuelEfficiency}` : 'N/A'}
                            </p>
                            {vehicle.fuelEfficiency && (
                                <p className="text-xs text-muted-foreground">km/l</p>
                            )}
                        </div>
                    </div>

                    <div className="p-5 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-4">
                        <div className="flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Enviar QR por Email</h4>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                            Selecciona una acción y envía el código QR con la información del vehículo
                        </p>

                        <Select value={action} onValueChange={(value) => setAction(value as VehicleAction)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar acción para el vehículo" />
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
                            <Button onClick={handleSendEmail} disabled={sending || !email || !action}>
                                <Send className="w-4 h-4 mr-2" />
                                {sending ? 'Enviando...' : 'Enviar'}
                            </Button>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${
                                message.type === 'success' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        {/* QR Preview */}
                        <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                            <img
                                src={getQRCodeUrl(vehicle.id)}
                                alt="QR Code del vehículo"
                                className="w-20 h-20 border rounded bg-white"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <div className="text-xs text-muted-foreground">
                                <p className="font-medium text-foreground text-sm">Vista previa del QR</p>
                                <p>Este código incluye toda la información del vehículo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
