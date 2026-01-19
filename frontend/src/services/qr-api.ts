const QR_API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// Get QR code image URL for a vehicle
export function getQRCodeUrl(vehicleId: string): string {
    return `${QR_API_BASE_URL}/api/qr/${vehicleId}`;
}

// Get QR code as blob (for downloading/sending)
export async function getQRCodeBlob(vehicleId: string): Promise<Blob> {
    const response = await fetch(getQRCodeUrl(vehicleId));
    if (!response.ok) {
        throw new Error('Failed to fetch QR code');
    }
    return response.blob();
}

// Fetch existing QR code by ID
export async function fetchQRCode(qrCodeId: string): Promise<Blob> {
    const response = await fetch(`${QR_API_BASE_URL}/api/qr/get/${qrCodeId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch QR code');
    }
    return response.blob();
}

// Send QR code via email (mock implementation - needs backend endpoint)
export async function sendQRCodeByEmail(
    vehicleId: string,
    email: string,
    action: string
): Promise<{ success: boolean; message: string }> {
    // TODO: Implement actual backend endpoint for email sending
    // For now, this is a placeholder that simulates the request
    console.log(`Sending QR for vehicle ${vehicleId} to ${email} with action: ${action}`);

    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: `QR enviado a ${email} para acción: ${action}`
            });
        }, 1000);
    });
}
