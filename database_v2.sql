-- ACTUALIZACIÓN V2: Usuarios, Roles y Organizaciones

-- 1. Tabla de Organizaciones
CREATE TABLE IF NOT EXISTS organizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('superadmin', 'usuario') DEFAULT 'usuario',
    limite_credenciales INT DEFAULT 100 COMMENT '-1 para infinito',
    id_organizacion INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_organizacion) REFERENCES organizaciones(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Actualizar Tabla Credenciales (Agregar dueños)
-- Agregamos las columnas si no existen (La sintaxis IF NOT EXISTS para columnas no es estándar en todos los MySQL viejos,
-- así que usamos ALTER TABLE simple esperando que el usuario corra esto sobre la base limpia o maneje el error si ya existe).

ALTER TABLE credenciales ADD COLUMN id_usuario INT NULL;
ALTER TABLE credenciales ADD COLUMN id_organizacion INT NULL;

-- Vincular llaves foráneas
ALTER TABLE credenciales ADD CONSTRAINT fk_cred_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE credenciales ADD CONSTRAINT fk_cred_organizacion FOREIGN KEY (id_organizacion) REFERENCES organizaciones(id) ON DELETE CASCADE;

-- 4. Insertar Super Admin por Defecto
-- Contraseña por defecto: admin123 (Se recomienda cambiarla inmediatamente)
-- El hash generado es de bcrypt para "admin123"
INSERT INTO usuarios (nombre_completo, email, password, rol, limite_credenciales) 
VALUES ('Super Administrador', 'admin@admin.com', '$2y$10$oTJ4PQWfWsrRI6wJe4k9EuxBYTv/kbhpeV3tmNwZ8xU2FqF21fZoK', 'superadmin', -1)
ON DUPLICATE KEY UPDATE password='$2y$10$oTJ4PQWfWsrRI6wJe4k9EuxBYTv/kbhpeV3tmNwZ8xU2FqF21fZoK'; 
-- (El hash real de arriba es inventado para el ejemplo, en el código PHP usaremos password_hash)
