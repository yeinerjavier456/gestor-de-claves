<?php
// backend/api/create.php
// Endpoint para crear credencial con soporte para asignación de admin Y NUEVOS CAMPOS

include_once '../config.php';
include_once 'cors.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "No autorizado."));
    exit();
}

$user_id = $_SESSION['user_id'];
$user_role = isset($_SESSION['user_role']) ? $_SESSION['user_role'] : 'usuario';

// Obtener límite usuario
try {
    $stmt = $conn->prepare("SELECT limite_credenciales FROM usuarios WHERE id = :id");
    $stmt->bindParam(":id", $user_id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $user_limit = $row ? $row['limite_credenciales'] : 100;
} catch (Exception $e) {
    $user_limit = 100;
}

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->plataforma) &&
    !empty($data->url) &&
    !empty($data->usuario) &&
    !empty($data->password)
) {
    try {
        // Verificar límite
        if ($user_limit != -1) {
            $countQuery = "SELECT COUNT(*) as total FROM credenciales WHERE id_usuario = :uid";
            $stmtCount = $conn->prepare($countQuery);
            $stmtCount->bindParam(":uid", $user_id);
            $stmtCount->execute();
            $count = $stmtCount->fetch(PDO::FETCH_ASSOC)['total'];

            if ($count >= $user_limit) {
                http_response_code(403);
                echo json_encode(array("message" => "Límite alcanzado."));
                exit();
            }
        }

        // Determinar Organización
        $org = NULL;
        $compartir = isset($data->compartir) ? $data->compartir : false;

        if ($user_role === 'superadmin' && !empty($data->id_organizacion)) {
            $org = $data->id_organizacion;
        } elseif ($compartir && !empty($_SESSION['user_org'])) {
            $org = $_SESSION['user_org'];
        }

        // Nuevos campos opcionales
        $ip = !empty($data->ip_servidor) ? $data->ip_servidor : NULL;
        $ruta = !empty($data->ruta_almacenamiento) ? $data->ruta_almacenamiento : NULL;
        $notas = !empty($data->notas) ? $data->notas : NULL;

        $query = "INSERT INTO credenciales SET 
                    plataforma=:plataforma, 
                    url=:url, 
                    usuario=:usuario, 
                    password=:password, 
                    id_usuario=:uid,
                    id_organizacion=:org,
                    ip_servidor=:ip,
                    ruta_almacenamiento=:ruta,
                    notas=:notas";

        $stmt = $conn->prepare($query);

        $plataforma = htmlspecialchars(strip_tags($data->plataforma));
        $url = htmlspecialchars(strip_tags($data->url));
        $usuario = htmlspecialchars(strip_tags($data->usuario));
        $password = htmlspecialchars(strip_tags($data->password));
        if ($ip)
            $ip = htmlspecialchars(strip_tags($ip));
        if ($ruta)
            $ruta = htmlspecialchars(strip_tags($ruta));
        if ($notas)
            $notas = htmlspecialchars(strip_tags($notas));

        $stmt->bindParam(":plataforma", $plataforma);
        $stmt->bindParam(":url", $url);
        $stmt->bindParam(":usuario", $usuario);
        $stmt->bindParam(":password", $password);
        $stmt->bindParam(":uid", $user_id);
        $stmt->bindParam(":org", $org);
        $stmt->bindParam(":ip", $ip);
        $stmt->bindParam(":ruta", $ruta);
        $stmt->bindParam(":notas", $notas);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Credencial creada."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo crear."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos."));
}
?>