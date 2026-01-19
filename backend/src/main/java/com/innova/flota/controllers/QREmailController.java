package com.innova.flota.controllers;

import com.innova.flota.services.EmailService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class QREmailController {

    private final EmailService emailService;

    public QREmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-email")
    public ResponseEntity<?> sendQREmail(@RequestBody QREmailRequest request) {
        try {
            // generar el codigo QR
            byte[] qrCodeBytes = generateQRCode(request.vehicleData());
            
            // ver que contenido tendra el correo dependiendo de la accion q se quiera realizar
            String subject = getEmailSubject(request.action());
            String message = getEmailMessage(request.action(), request.vehicleData());
            
            // enviar correo
            emailService.sendQREmail(request.email(), qrCodeBytes, subject, message);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Correo enviado exitosamente a " + request.email()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error al enviar el correo: " + e.getMessage()
            ));
        }
    }

    private byte[] generateQRCode(String data) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 300, 300);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        
        return outputStream.toByteArray();
    }

    private String getEmailSubject(String action) {
        return switch (action) {
            case "status" -> "📋 Código QR - Consulta de Estado del Vehículo";
            case "pickup" -> "🚛 Código QR - Programar Recogida del Vehículo";
            case "maintenance" -> "🔧 Código QR - Solicitud de Mantenimiento";
            case "history" -> "📊 Código QR - Historial del Vehículo";
            default -> "🚗 Código QR - Información del Vehículo";
        };
    }

    private String getEmailMessage(String action, String vehicleData) {
        return switch (action) {
            case "status" -> 
                "Hemos generado el código QR para <strong>consultar el estado actual</strong> de su vehículo. " +
                "Escanee este código en nuestro taller o en la aplicación móvil para ver el estado en tiempo real, " +
                "incluyendo nivel de combustible, batería, salud del motor y más.";
            
            case "pickup" -> 
                "Hemos generado el código QR para <strong>programar la recogida</strong> de su vehículo. " +
                "Presente este código a nuestro personal de logística o escanéelo en el punto de recogida. " +
                "Nuestro equipo coordinará la fecha y hora más conveniente para usted.";
            
            case "maintenance" -> 
                "Hemos generado el código QR para <strong>solicitar mantenimiento</strong> de su vehículo. " +
                "Este código contiene toda la información técnica necesaria para que nuestro taller pueda " +
                "preparar el servicio adecuado. Escanéelo al llegar al taller o envíelo por WhatsApp.";
            
            case "history" -> 
                "Hemos generado el código QR para acceder al <strong>historial completo</strong> de su vehículo. " +
                "Escanee este código para ver todos los mantenimientos realizados, viajes registrados y " +
                "el estado histórico de los componentes del vehículo.";
            
            default -> 
                "Hemos generado el código QR con la <strong>información completa</strong> de su vehículo. " +
                "Este código puede ser utilizado para cualquier consulta o servicio relacionado con su vehículo.";
        };
    }

    public record QREmailRequest(
        String email,
        String action,
        String vehicleData
    ) {}
}
