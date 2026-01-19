# Gestor de Credenciales y Sitios 🔐

Un sistema moderno, seguro y responsive para la gestión centralizada de contraseñas y accesos. Diseñado para equipos y usuarios individuales, permite almacenar credenciales, organizarlas y compartirlas de forma segura dentro de una organización.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB.svg)
![PHP](https://img.shields.io/badge/backend-PHP%20%2B%20MySQL-777BB4.svg)

## ✨ Características Principales

*   **Autenticación Segura**: Sistema de Login con manejo de sesiones y hash de contraseñas (bcrypt).
*   **Gestión de Credenciales (CRUD)**:
    *   Almacena URL, Usuario, Contraseña, Plataforma.
    *   **NUEVO**: Campos opcionales para IP de Servidor, Ruta de Almacenamiento y Notas.
    *   Opciones de copiado rápido al portapapeles.
*   **Roles y Permisos**:
    *   **Usuario**: Gestiona sus propias claves y ve las compartidas por su organización.
    *   **Super Admin**: Panel dedicado para gestionar usuarios y organizaciones.
*   **Organizaciones**:
    *   Creación de organizaciones (equipos/departamentos).
    *   Compartir credenciales automáticamente con todos los miembros de la organización.
    *   Asignación manual de credenciales a organizaciones por parte del Admin.
*   **Interfaz Moderna**:
    *   Diseño "Glassmorphism" con modo oscuro.
    *   **Sidebar Responsive**: Navegación fluida en escritorio y móvil.
    *   Vista separada para Crear y Listar.

## 🛠️ Tecnologías

### Frontend
*   **React 19**: Biblioteca UI.
*   **Vite**: Build tool rápido.
*   **CSS Puro (Moderno)**: Variables CSS, Grid, Flexbox, Glassmorphism.
*   **Context API**: Manejo de estado de autenticación.

### Backend
*   **PHP 8+**: API RESTful.
*   **MySQL**: Base de datos relacional.
*   **PDO**: Capa de abstracción de base de datos segura contra inyecciones SQL.

## 🚀 Instalación y Despliegue

### Requisitos Previos
*   Un servidor Web (Apache/Nginx) con PHP 8.0+.
*   MySQL / MariaDB.
*   Node.js (solo para desarrollo/build del frontend).

### 1. Base de Datos
1.  Crea una base de datos en tu servidor MySQL.
2.  Importa el archivo script principal: `database_v2.sql`.
3.  Si necesitas los campos extra (IP, Notas), ejecuta también: `update_fields.sql`.

### 2. Backend (API)
1.  Sube el contenido de la carpeta `backend/` a tu servidor (ej: `public_html/backend/`).
2.  Renombra `backend/config.sample.php` a `backend/config.php`.
3.  Edita `config.php` y pon tus credenciales de base de datos:
    ```php
    $host = 'localhost';
    $db_name = 'tu_base_datos';
    $username = 'tu_usuario';
    $password = 'tu_password';
    ```

### 3. Frontend (React)
1.  Instala dependencias y corre el build para producción:
    ```bash
    cd frontend
    npm install
    npm run build
    ```
2.  El contenido generado en `frontend/dist/` es lo que debes subir a la raíz de tu servidor (`public_html/`).

### Acceso Inicial
*   **Url**: `http://tu-dominio.com`
*   **Super Admin**: `admin@admin.com`
*   **Password**: `admin123` (¡Cámbiala inmediatamente en el perfil!)

## 📁 Estructura del Proyecto

```
/
├── backend/            # API PHP
│   ├── api/            # Endpoints (auth, users, credentials)
│   └── config.php      # Configuración DB
├── frontend/           # SPA React
│   ├── src/
│   │   ├── components/ # Sidebar, Forms, Lists
│   │   ├── context/    # AuthContext
│   │   └── services/   # Llamadas API
│   └── vite.config.js
├── database_v2.sql     # Esquema SQL
└── README.md           # Documentación
```

## 🔒 Seguridad
*   Las contraseñas de acceso al sistema están hasheadas (bcrypt).
*   Las contraseñas de las credenciales guardadas se almacenan en texto plano (por diseño actual para recuperación), se recomienda implementar encriptación en reposo en versiones futuras si se requiere mayor seguridad.
*   Protección CORS configurada.

---
Desarrollado con ❤️ por Yeiner Bejarano.
