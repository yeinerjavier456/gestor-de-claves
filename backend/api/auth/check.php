<?php
// backend/api/auth/check.php
include_once '../../config.php';
include_once '../cors.php';

session_start();

if (isset($_SESSION['user_id'])) {
    // Si la sesión existe, devolvemos los datos del usuario actualizados de la BD (por si cambió el rol o límite)
    try {
        $query = "SELECT id, nombre_completo, email, rol, limite_credenciales, id_organizacion FROM usuarios WHERE id = :id LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id", $_SESSION['user_id']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(array(
                "authenticated" => true,
                "user" => $user
            ));
        } else {
            // El usuario en sesión ya no existe en DB
            session_destroy();
            http_response_code(401);
            echo json_encode(array("authenticated" => false));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al verificar sesión"));
    }
} else {
    http_response_code(200); // OK, pero no autenticado
    echo json_encode(array("authenticated" => false));
}
?>