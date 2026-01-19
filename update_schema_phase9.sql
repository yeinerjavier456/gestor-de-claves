-- Script Fase 9: Gestión de Organizaciones por Usuario
-- Ejecutar en phpMyAdmin

-- 1. Agregar columna 'id_creador' a tabla 'organizaciones'
ALTER TABLE organizaciones 
ADD COLUMN id_creador INT NULL AFTER descripcion,
ADD CONSTRAINT fk_org_creador FOREIGN KEY (id_creador) REFERENCES usuarios(id) ON DELETE SET NULL;

-- 2. Agregar columna 'limite_organizaciones' a tabla 'usuarios' (Default 10)
ALTER TABLE usuarios
ADD COLUMN limite_organizaciones INT DEFAULT 10 AFTER limite_credenciales;

-- 3. (Opcional) Asignar creador 'superadmin' a organizaciones existentes si se desea
-- UPDATE organizaciones SET id_creador = (SELECT id FROM usuarios WHERE rol='superadmin' LIMIT 1) WHERE id_creador IS NULL;
