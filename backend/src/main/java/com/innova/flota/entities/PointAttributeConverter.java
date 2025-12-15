package com.innova.flota.entities;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.data.geo.Point;

@Converter(autoApply = false)
public class PointAttributeConverter implements AttributeConverter<Point, String> {

    @Override
    public String convertToDatabaseColumn(Point attribute) {
        if (attribute == null) return null;
        // Use Postgres point literal format with parentheses: (x,y)
        return "(" + attribute.getX() + "," + attribute.getY() + ")";
    }

    @Override
    public Point convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return null;
        String cleaned = dbData.trim();
        if (cleaned.startsWith("(")) cleaned = cleaned.substring(1);
        if (cleaned.endsWith(")")) cleaned = cleaned.substring(0, cleaned.length() - 1);
        String[] parts = cleaned.split(",");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid point value from DB: " + dbData);
        }
        try {
            double x = Double.parseDouble(parts[0]);
            double y = Double.parseDouble(parts[1]);
            return new Point(x, y);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Failed to parse point coordinates: " + dbData, e);
        }
    }
}
