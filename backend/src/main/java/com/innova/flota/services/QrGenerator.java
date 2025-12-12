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

import java.awt.image.BufferedImage;

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

        if (vehicleRepository.findById(id).isPresent()){
            Vehicle vehicle =  vehicleRepository.findById(id).get();

            String barcodeText = "Modelo: " + vehicle.getMarca() + " " + vehicle.getModelo() +
                    "\n Patente: " + vehicle.getPatente() +
                    "\n KM recorridos: " + vehicle.getKmRecorrido();
            BitMatrix bitMatrix =
            barcodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, 400, 400);

            QRCode  qrCode= new QRCode();
            qrCode.setBarcodeText(barcodeText);
            qrCodeRepository.save(qrCode);
            return MatrixToImageWriter.toBufferedImage(bitMatrix);
        }else{
            return null;
        }
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
