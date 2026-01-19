<?php
// backend/api/users/update.php
// Actualizar datos de usuario COMPLETOS

include_once '../../config.php';
include_once '../cors.php';
include_once '../auth/admin_check.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        // Campos básicos
        $campos = "limite_credenciales = :limite, rol = :rol, id_organizacion = :org";

        // Si vienen campos opcionales, agregarlos al query
        if (!empty($data->nombre))
            $campos .= ", nombre_completo = :nombre";
        if (!empty($data->email))
            $campos .= ", email = :email";
        if (!empty($data->password))
            $campos .= ", password = :pass"; // Se debe hashear

        $query = "UPDATE usuarios SET $campos WHERE id = :id";
        $stmt = $conn->prepare($query);

        // Bindings fijos
        $limite = isset($data->limite_credenciales) ? $data->limite_credenciales : 100;
        $rol = !empty($data->rol) ? $data->rol : 'usuario';
        $org = (!empty($data->id_organizacion) && $data->id_organizacion != '0') ? $data->id_organizacion : NULL;

        $stmt->bindParam(":limite", $limite);
        $stmt->bindParam(":rol", $rol);
        $stmt->bindParam(":org", $org);
        $stmt->bindParam(":id", $data->id);

        // Bindings dinámicos
        if (!empty($data->nombre)) {
            $nombre = htmlspecialchars(strip_tags($data->nombre));
            $stmt->bindParam(":nombre", $nombre);
        }
        if (!empty($data->email)) {
            $email = htmlspecialchars(strip_tags($data->email));
            $stmt->bindParam(":email", $email);
        }
        if (!empty($data->password)) {
            $pass = password_hash($data->password, PASSWORD_DEFAULT);
            $stmt->bindParam(":pass", $pass);
        }

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Usuario actualizado."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo actualizar."));
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error." . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Falta ID."));
}
?>