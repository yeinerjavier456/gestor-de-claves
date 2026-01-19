-- Script de Migración a Multi-Organización (Fase 8)
-- Ejecutar en phpMyAdmin

-- 1. Crear tabla intermedia
CREATE TABLE IF NOT EXISTS usuarios_organizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_organizacion INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_organizacion) REFERENCES organizaciones(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_org (id_usuario, id_organizacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Migrar datos existentes (Si existen usuarios con organización asignada)
INSERT INTO usuarios_organizaciones (id_usuario, id_organizacion)
SELECT id, id_organizacion FROM usuarios WHERE id_organizacion IS NOT NULL;

-- 3. (Opcional) Eliminar la columna antigua id_organizacion de la tabla usuarios
-- Se recomienda mantenerla un tiempo por seguridad o renombrarla, pero para limpiar:
-- ALTER TABLE usuarios DROP FOREIGN KEY usuarios_ibfk_1; (El nombre de la FK puede variar)
-- ALTER TABLE usuarios DROP COLUMN id_organizacion;
-- Por ahora la dejaremos como "legacy" y no la usaremos en el nuevo código.
