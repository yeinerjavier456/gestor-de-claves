<?php
// backend/api/users/create.php
// Crear nuevo usuario (Solo Admin)

include_once '../../config.php';
include_once '../cors.php';
include_once '../auth/admin_check.php'; // Verifica rol

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->nombre) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    try {
        // Verificar si email ya existe
        $check = $conn->prepare("SELECT id FROM usuarios WHERE email = :email");
        $check->bindParam(":email", $data->email);
        $check->execute();

        if ($check->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "El email ya está registrado."));
            exit();
        }

        $query = "INSERT INTO usuarios SET 
                    nombre_completo=:nombre, 
                    email=:email, 
                    password=:pass, 
                    rol=:rol, 
                    limite_credenciales=:limite, 
                    id_organizacion=:org";

        $stmt = $conn->prepare($query);

        $nombre = htmlspecialchars(strip_tags($data->nombre));
        $email = htmlspecialchars(strip_tags($data->email));
        $pass = password_hash($data->password, PASSWORD_DEFAULT);
        $rol = !empty($data->rol) ? $data->rol : 'usuario';
        $limite = isset($data->limite) ? $data->limite : 100;
        $org = !empty($data->id_organizacion) ? $data->id_organizacion : NULL;

        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":pass", $pass);
        $stmt->bindParam(":rol", $rol);
        $stmt->bindParam(":limite", $limite);
        $stmt->bindParam(":org", $org);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Usuario creado exitosamente."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo crear usuario."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error del servidor."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos."));
}
?>