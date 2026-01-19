<?php
// backend/api/delete.php
// Endpoint para eliminar credencial (Solo el dueño)

include_once '../config.php';
include_once 'cors.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "No autorizado."));
    exit();
}

$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'] ?? 'usuario';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        // Verificar si la credencial pertenece al usuario
        // O si es superadmin (el superadmin puede borrar todo si quiere, lo permitiremos)
        $checkQuery = "SELECT id_usuario FROM credenciales WHERE id = :id";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(":id", $data->id);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            $row = $checkStmt->fetch(PDO::FETCH_ASSOC);
            $owner_id = $row['id_usuario'];

            if ($owner_id == $user_id || $user_role == 'superadmin') {
                // Proceder a borrar
                $query = "DELETE FROM credenciales WHERE id = :id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(":id", $data->id);

                if ($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Credencial eliminada."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar."));
                }
            } else {
                http_response_code(403);
                echo json_encode(array("message" => "No tienes permiso para eliminar esta credencial."));
            }
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Credencial no encontrada."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error del servidor."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Falta ID."));
}
?>