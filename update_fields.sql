-- Script para agregar campos adicionales
-- Ejecutar en SQL de phpMyAdmin

ALTER TABLE credenciales
ADD COLUMN ip_servidor VARCHAR(50) NULL AFTER password,
ADD COLUMN ruta_almacenamiento VARCHAR(255) NULL AFTER ip_servidor,
ADD COLUMN notas TEXT NULL AFTER ruta_almacenamiento;
