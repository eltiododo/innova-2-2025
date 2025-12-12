package com.innova.flota.controllers;

import com.innova.flota.services.QrGenerator;
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

    @GetMapping(value="/test",produces = MediaType.IMAGE_PNG_VALUE)

    public ResponseEntity<BufferedImage> test() throws Exception {

        Long id = 2L;
        return ResponseEntity.ok(qrGenerator.generateQRCodeImage(id));
    }

    @GetMapping(value = "/{id}",produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<BufferedImage> vehicleData(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok(qrGenerator.generateQRCodeImage(id));
    }
    @Bean
    public HttpMessageConverter<BufferedImage> createImageHttpMessageConverter() {
        return new BufferedImageHttpMessageConverter();
    }

    @GetMapping(value = "get/{id}",produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<BufferedImage> getCode(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(qrGenerator.getQrCode(id));
    }

}
