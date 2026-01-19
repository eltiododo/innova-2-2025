package com.innova.flota.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.innova.flota.entities.QRCode;
import com.innova.flota.entities.Vehicle;
import com.innova.flota.repositories.QRCodeRepository;
import com.innova.flota.repositories.VehicleRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.awt.image.BufferedImage;
import java.util.Optional;

@Service
public class QrGenerator {
    private final VehicleRepository vehicleRepository;
    private final QRCodeRepository qrCodeRepository;

    public QrGenerator(VehicleRepository vehicleRepository, QRCodeRepository qrCodeRepository) {
        this.vehicleRepository = vehicleRepository;
        this.qrCodeRepository = qrCodeRepository;
    }

    public BufferedImage generateQRCodeImage(Long id) throws Exception {
        QRCodeWriter barcodeWriter = new QRCodeWriter();
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(id);

        if (vehicleOptional.isEmpty()) {
            return null;
        }
        Vehicle vehicle = vehicleOptional.get();

        // save qr first to get its Id
        QRCode qrCode = new QRCode();
        qrCodeRepository.save(qrCode);

        // Construct the JSON logic
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonNode = mapper.valueToTree(vehicle);

        jsonNode.put("id_qr", String.valueOf(qrCode.getId()));

        // add qrcode's id into the json
        if (jsonNode.has("id")) {
            jsonNode.put("id_vehicle", jsonNode.get("id").asText());
            jsonNode.remove("id");
        }

        jsonNode.remove("driver");
        // it used to work without removing these... what happened? ;_;
        jsonNode.remove("fuelEfficiency");
        jsonNode.remove("batteryHealth");
        jsonNode.remove("engineHealth");
        jsonNode.remove("odometerReading");

        String finalBarcodeText = mapper.writeValueAsString(jsonNode);
        qrCode.setBarcodeText(finalBarcodeText);
        qrCodeRepository.save(qrCode);

        int size = 400;

        BitMatrix bitMatrix = barcodeWriter.encode(
                finalBarcodeText,
                BarcodeFormat.QR_CODE,
                size,
                size
        );
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }

    public BufferedImage getQrCode(Long id) throws Exception {
        QRCodeWriter barcodeWriter = new QRCodeWriter();

        if (qrCodeRepository.findById(id).isPresent()) {
            QRCode qrCode = qrCodeRepository.findById(id).get();
            String barcodeText = qrCode.getBarcodeText();
            BitMatrix bitMatrix = barcodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, 400, 400);
            return MatrixToImageWriter.toBufferedImage(bitMatrix);

        } else {
            return null;
        }
    }
}
