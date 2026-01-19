package com.innova.flota.model;

import jakarta.persistence.*;

@Entity
@Table(name = "qrcodes")
public class QRCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "barcode_text")
    private String barcodeText;

    public QRCode() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getBarcodeText() { return barcodeText; }
    public void setBarcodeText(String barcodeText) { this.barcodeText = barcodeText; }
}
