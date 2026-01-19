<?php
// backend/api/organizations/manage.php
include_once '../cors.php';
include_once '../../config.php';
require '../auth_check.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'];

if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID requerido"]);
    exit;
}

try {
    // Verificar propiedad
    // Buscamos quién es el creador
    $stmtCheck = $conn->prepare("SELECT id_creador FROM organizaciones WHERE id = :id");
    $stmtCheck->bindParam(':id', $data->id);
    $stmtCheck->execute();

    if ($stmtCheck->rowCount() === 0) {
        echo json_encode(["success" => false, "message" => "Organización no encontrada"]);
        exit;
    }

    $creator_id = $stmtCheck->fetchColumn();

    // Validar Permisos: SuperAdmin O Creador
    if ($user_role !== 'superadmin' && $creator_id != $user_id) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "No tienes permiso para gestionar esta organización"]);
        exit;
    }

    if ($method === 'PUT') {
        // Actualizar
        $query = "UPDATE organizaciones SET nombre = :nombre, descripcion = :desc WHERE id = :id";
        $stmt = $conn->prepare($query);

        $desc = isset($data->descripcion) ? $data->descripcion : '';

        $stmt->bindParam(':nombre', $data->nombre);
        $stmt->bindParam(':desc', $desc);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Organización actualizada"]);
        } else {
            throw new Exception("Error al actualizar");
        }

    } elseif ($method === 'DELETE') {
        // Eliminar
        // ON DELETE CASCADE en tablas relacionadas debería limpiarlo todo (credenciales, usuarios_organizaciones)
        // Pero verificamos si hay restricciones manuales si no se configuró cascade.
        // Asumiremos que la BD lo maneja o que queremos eliminar.

        // Primero eliminamos la relación para este usuario (aunque si borramos la org, se borra todo)
        // Delete org
        $query = "DELETE FROM organizaciones WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Organización eliminada"]);
        } else {
            throw new Exception("Error al eliminar");
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>