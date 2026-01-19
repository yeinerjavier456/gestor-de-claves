<?php
// backend/api/update.php
include_once 'cors.php';
include_once '../config.php';
require 'auth_check.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (
    !isset($data->id) ||
    !isset($data->plataforma) ||
    !isset($data->url) ||
    !isset($data->usuario) ||
    !isset($data->password)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    // 1. Verificar propiedad (solo dueño o superadmin puede editar)
    // También verificar si la organización cambió, etc.
    // Por simplicidad: si eres dueño O superadmin, puedes editar todo.

    $check_sql = "SELECT id_usuario, id_organizacion FROM credenciales WHERE id = :id";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bindParam(':id', $data->id);
    $check_stmt->execute();

    if ($check_stmt->rowCount() == 0) {
        echo json_encode(["success" => false, "message" => "Credencial no encontrada"]);
        exit;
    }

    $row = $check_stmt->fetch(PDO::FETCH_ASSOC);

    if ($row['id_usuario'] != $_SESSION['user_id'] && $_SESSION['user_role'] !== 'superadmin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "No tienes permiso para editar esta credencial"]);
        exit;
    }

    // 2. Actualizar
    // Nota: password se guarda en texto plano según lo solicitado (aunque debería encriptarse, seguimos el modelo de create.php)

    $query = "UPDATE credenciales SET 
                plataforma = :plataforma,
                url = :url,
                usuario = :usuario,
                password = :password,
                ip_servidor = :ip,
                ruta_almacenamiento = :ruta,
                notas = :notas,
                id_organizacion = :id_org
              WHERE id = :id";

    $stmt = $conn->prepare($query);

    // CAMPOS OPCIONALES
    $ip = isset($data->ip_servidor) ? $data->ip_servidor : null;
    $ruta = isset($data->ruta_almacenamiento) ? $data->ruta_almacenamiento : null;
    $notas = isset($data->notas) ? $data->notas : null;

    // ORG LOGIC
    $id_org = null;
    // Si envían id_organizacion, usarlo. Si enviar compartir=true pero sin id_org, error?
    // Asumiremos que el frontend gestiona la lógica de compartir.
    if (!empty($data->id_organizacion)) {
        $id_org = $data->id_organizacion;
    } elseif (isset($data->compartir) && $data->compartir == true) {
        // Buscar org del usuario si no es admin, o si ya tenía.
        // Simplificación: Si el user no envia id_org explícito (ej admin), usamos NULL o lógica compleja.
        // Mantendremos la lógica simple: Update set id_organizacion = LO QUE VENGA.
    }

    $stmt->bindParam(':plataforma', $data->plataforma);
    $stmt->bindParam(':url', $data->url);
    $stmt->bindParam(':usuario', $data->usuario);
    $stmt->bindParam(':password', $data->password);
    $stmt->bindParam(':ip', $ip);
    $stmt->bindParam(':ruta', $ruta);
    $stmt->bindParam(':notas', $notas);
    $stmt->bindParam(':id_org', $id_org);
    $stmt->bindParam(':id', $data->id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Credencial actualizada exitosamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar en BD."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>