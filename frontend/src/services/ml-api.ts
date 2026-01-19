import type {
    MaintenancePredictionInput,
    MaintenancePredictionResponse,
    RouteOptimizationInput,
    RouteOptimizationResponse
} from '@/types';

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

// Health check
export async function checkMLHealth(): Promise<{ status: string; model_loaded: boolean }> {
    const response = await fetch(`${ML_API_BASE_URL}/health`);
    if (!response.ok) {
        throw new Error('ML API health check failed');
    }
    return response.json();
}

// Predict maintenance needs
export async function predictMaintenance(
    input: MaintenancePredictionInput
): Promise<MaintenancePredictionResponse> {
    const response = await fetch(`${ML_API_BASE_URL}/predict-maintenance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error('Failed to predict maintenance');
    }

    return response.json();
}

// Optimize routes for fleet
export async function optimizeRoutes(
    input: RouteOptimizationInput
): Promise<RouteOptimizationResponse> {
    const response = await fetch(`${ML_API_BASE_URL}/optimize-routes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error('Failed to optimize routes');
    }

    return response.json();
}
