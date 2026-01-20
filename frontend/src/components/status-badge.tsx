import { Badge } from '@/components/ui/badge';
import type { VehicleStatus } from '@/types';

interface StatusBadgeProps {
    status: VehicleStatus;
    className?: string;
}

const statusConfig: Record<VehicleStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    OPERATIONAL: {
        label: 'Operativo',
        variant: 'default',
    },
    PENDING_REVIEW: {
        label: 'Revisión Pendiente',
        variant: 'secondary',
    },
    IN_MAINTENANCE: {
        label: 'En Mantención',
        variant: 'destructive',
    },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}
