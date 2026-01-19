<?php
// backend/api/auth/admin_check.php
// Middleware para asegurar que el usuario es Super Admin

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] != 'superadmin') {
    http_response_code(403);
    echo json_encode(array("message" => "Acceso denegado. Se requiere rol de Super Administrador."));
    exit();
}
?>