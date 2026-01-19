package com.innova.flota.repositories;

import com.innova.flota.model.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QRCodeRepository extends JpaRepository<QRCode,Long> {
}
