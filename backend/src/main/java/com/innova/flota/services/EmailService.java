package com.innova.flota.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendQREmail(String toEmail, byte[] qrCodeBytes, String subject, String message) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(buildEmailBody(message), true);
        
        helper.addAttachment("qr-code.png", new ByteArrayResource(qrCodeBytes));

        mailSender.send(mimeMessage);
    }

    private String buildEmailBody(String customMessage) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Innova Fleet Management</h1>
                    </div>
                    <div class="content">
                        <p>Estimado/a usuario/a,</p>
                        <p>%s</p>
                        <p>Adjunto encontrará el código QR solicitado con toda la información necesaria.</p>
                        <p><strong>Importante:</strong> Este código QR es único y contiene información sensible acerca del vehículo. Por favor, no lo comparta con terceros.</p>
                        <p>Si tiene alguna pregunta o necesita asistencia adicional, no dude en contactarnos.</p>
                        <p>Saludos cordiales,<br><strong>Equipo Innova Fleet</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2026 Innova Fleet Management. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(customMessage);
    }
}
