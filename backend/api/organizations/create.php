<?php
// backend/api/organizations/create.php
include_once '../cors.php';
include_once '../../config.php';
require '../auth_check.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));
$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'];

if (!isset($data->nombre)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Nombre de organización requerido"]);
    exit;
}

try {
    $conn->beginTransaction();

    // 1. Verificar límite de organizaciones del usuario (si no es superadmin)
    if ($user_role !== 'superadmin') {
        // Obtener límite del usuario
        $stmtLimit = $conn->prepare("SELECT limite_organizaciones FROM usuarios WHERE id = :uid");
        $stmtLimit->bindParam(':uid', $user_id);
        $stmtLimit->execute();
        $limit = $stmtLimit->fetchColumn(); // Retorna el valor o false

        // Contar cuantas ha creado
        $stmtCount = $conn->prepare("SELECT COUNT(*) FROM organizaciones WHERE id_creador = :uid");
        $stmtCount->bindParam(':uid', $user_id);
        $stmtCount->execute();
        $createdCount = $stmtCount->fetchColumn();

        if ($limit !== false && $createdCount >= $limit) {
            $conn->rollBack();
            echo json_encode(["success" => false, "message" => "Has alcanzado tu límite de organizaciones ($limit)."]);
            exit;
        }
    }

    // 2. Insertar Organización
    $query = "INSERT INTO organizaciones (nombre, descripcion, id_creador) VALUES (:nombre, :descripcion, :creador)";
    $stmt = $conn->prepare($query);

    $desc = isset($data->descripcion) ? $data->descripcion : '';

    $stmt->bindParam(':nombre', $data->nombre);
    $stmt->bindParam(':descripcion', $desc);
    $stmt->bindParam(':creador', $user_id);

    if (!$stmt->execute()) {
        throw new Exception("Error al crear organización");
    }

    $org_id = $conn->lastInsertId();

    // 3. Asignar al creador como miembro de la organización automáticamente
    $queryRel = "INSERT INTO usuarios_organizaciones (id_usuario, id_organizacion) VALUES (:uid, :oid)";
    $stmtRel = $conn->prepare($queryRel);
    $stmtRel->bindParam(':uid', $user_id);
    $stmtRel->bindParam(':oid', $org_id);

    if (!$stmtRel->execute()) {
        throw new Exception("Error al asignar usuario a la organización");
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Organización creada exitosamente", "id" => $org_id]);

} catch (Exception $e) {
    if ($conn->inTransaction())
        $conn->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>