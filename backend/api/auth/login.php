<?php
// backend/api/auth/login.php
include_once '../../config.php';
include_once '../cors.php';

// Iniciar sesión
session_start();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        // Buscar usuario por email
        $query = "SELECT id, nombre_completo, password, rol, limite_credenciales, id_organizacion FROM usuarios WHERE email = :email LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $id = $row['id'];
            $nombre = $row['nombre_completo'];
            $hashed_password = $row['password'];
            $rol = $row['rol'];
            $limite = $row['limite_credenciales'];
            $id_org = $row['id_organizacion'];

            // Verificar contraseña
            // NOTA: Para el usuario admin por defecto del script SQL, la contraseña es 'admin123'.
            // Asegúrese que el hash en la DB coincida con password_hash('admin123', PASSWORD_DEFAULT).
            if (password_verify($data->password, $hashed_password)) {
                // Contraseña correcta
                $_SESSION['user_id'] = $id;
                $_SESSION['user_name'] = $nombre;
                $_SESSION['user_role'] = $rol;
                $_SESSION['user_org'] = $id_org;

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login exitoso",
                    "user" => array(
                        "id" => $id,
                        "nombre" => $nombre,
                        "email" => $data->email,
                        "rol" => $rol,
                        "id_organizacion" => $id_org,
                        "limite_credenciales" => $limite
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Contraseña incorrecta."));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Usuario no encontrado."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error en el servidor.", "error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Faltan datos."));
}
?>