package com.innova.flota.repositories;

import com.innova.flota.entities.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QRCodeRepository extends JpaRepository<QRCode,Long> {
}
