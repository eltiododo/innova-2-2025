package com.innova.flota.controllers;

import com.innova.flota.services.QrGenerator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.BufferedImageHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;

// ############# REST controller de prueba =) falta hacerlo en graphqls
@RestController
@RequestMapping("/api/qr")
public class QrController {
    private final QrGenerator qrGenerator;

    @Autowired
    public QrController(QrGenerator qrGenerator) {
        this.qrGenerator = qrGenerator;
    }


    @Operation(summary = "Genera un codigo QR", description = "Genera un condigo QR para un id en especifico para testear.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Codigo QR generado con exito.",
                    content = @Content(mediaType = "image/png")),
            @ApiResponse(responseCode = "500", description = "Error interno, el codigo QR no pudo ser generado.")
    })
    @GetMapping(value="/test",produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<BufferedImage> test() throws Exception {

        Long id = 2L;
        return ResponseEntity.ok(qrGenerator.generateQRCodeImage(id));
    }

    @Operation(summary = "Genera un codigo QR para un vehículo", description = "Retorna un codigo QR con la información del vehículo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Codigo QR generado de manera exitosa.",
                    content = @Content(mediaType = "image/png")),
            @ApiResponse(responseCode = "404", description = "ID entregado no existe"),
            @ApiResponse(responseCode = "500", description = "Error interno, el codigo QR no pudo ser generado.")
    })
    @GetMapping(value = "/{id}",produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<BufferedImage> vehicleData(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok(qrGenerator.generateQRCodeImage(id));
    }
    @Bean
    public HttpMessageConverter<BufferedImage> createImageHttpMessageConverter() {
        return new BufferedImageHttpMessageConverter();
    }

    @Operation(summary = "Obtener un codigo QR guardado", description = "Obtener el id del codigo QR a través del id generado al día de la consulta")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Codigo QR obtenido de manera existosa.",
                    content = @Content(mediaType = "image/png")),
            @ApiResponse(responseCode = "404", description = "ID entregado no existe."),
            @ApiResponse(responseCode = "500", description = "Internal server error if the QR code retrieval fails.")
    })
    @GetMapping(value = "get/{id}",produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<BufferedImage> getCode(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(qrGenerator.getQrCode(id));
    }

}
