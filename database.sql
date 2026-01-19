-- Script de Creación de Base de Datos para el Gestor de Credenciales
-- Instrucciones:
-- 1. Ingrese a phpMyAdmin en su hosting (Hostinger).
-- 2. Seleccione su base de datos.
-- 3. Vaya a la pestaña "SQL" o "Importar".
-- 4. Copie y pegue este código o suba este archivo.

CREATE TABLE IF NOT EXISTS credenciales (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la credencial',
    plataforma VARCHAR(100) NOT NULL COMMENT 'Nombre de la plataforma (ej: Facebook, Google)',
    url VARCHAR(255) NOT NULL COMMENT 'Dirección web de acceso',
    usuario VARCHAR(100) NOT NULL COMMENT 'Nombre de usuario o correo',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña de acceso',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha automática de registro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla principal de almacenamiento de contraseñas';
