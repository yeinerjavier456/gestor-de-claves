<?php
// backend/api/users/delete.php
// Eliminar usuario

include_once '../../config.php';
include_once '../cors.php';
include_once '../auth/admin_check.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        // Opcional: Evitar borrarte a ti mismo
        if ($data->id == $_SESSION['user_id']) {
            http_response_code(400);
            echo json_encode(array("message" => "No puedes eliminar tu propia cuenta."));
            exit();
        }

        // Primero borrar sus credenciales o reasignarlas? 
        // Por simplicidad, borramos credenciales en cascada si la FK está configurada asi, 
        // o las borramos manualmente. Asumiremos ON DELETE CASCADE en la BD o borrado manual.
        // Haremos borrado manual por seguridad.
        $queryCreds = "DELETE FROM credenciales WHERE id_usuario = :id";
        $stmtCreds = $conn->prepare($queryCreds);
        $stmtCreds->bindParam(":id", $data->id);
        $stmtCreds->execute();

        $query = "DELETE FROM usuarios WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id", $data->id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Usuario eliminado."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo eliminar usuario."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error servidor."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Falta ID."));
}
?>