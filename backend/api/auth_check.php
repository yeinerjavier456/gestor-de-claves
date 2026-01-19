<?php
// backend/api/auth_check.php
// Middleware para verificar sesión

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "No autorizado. Inicie sesión."]);
    exit;
}
?>