<?php
// backend/api/cors.php
// Función para manejar las cabeceras CORS

// En producción (mismo dominio), el origen suele ser el mismo.
// En desarrollo (localhost:5173 vs 8000), necesitamos especificar el origen exacto para usar credentials.

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Lista de origenes permitidos (localhost para dev, dominio real para prod)
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:4173', // Vite preview
    'http://sities.ydesarrollo.online',
    'https://sities.ydesarrollo.online'
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback para cuando no se envía origen (ej: curl) o producción mismo dominio
    // Si estamos en el mismo dominio, no hace falta CORS estricto, pero header * ayuda a veces
    // Sin embargo, con credentials true, * no es válido.
    // Si no coincide, no mandamos header o mandamos el mismo host.
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>