<?php
// backend/api/read.php
// Leer credenciales con filtros de visibilidad

include_once '../config.php';
include_once 'cors.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "No autenticado."));
    exit();
}

$user_id = $_SESSION['user_id'];
$user_role = isset($_SESSION['user_role']) ? $_SESSION['user_role'] : 'usuario';
$user_org = isset($_SESSION['user_org']) ? $_SESSION['user_org'] : NULL;

try {
    $query = "SELECT c.*, c.id_usuario as owner_id FROM credenciales c WHERE 1=1";

    // Si NO es superadmin, aplicar filtros
    if ($user_role !== 'superadmin') {
        if ($user_org) {
            // Usuario con org: ver propias O compartidas con su org
            $query .= " AND (c.id_usuario = :uid OR c.id_organizacion = :org)";
        } else {
            // Usuario sin org: solo las propias
            $query .= " AND c.id_usuario = :uid";
        }
    }
    // Nota: Superadmin ve TODO, por lo que no agregamos WHERE extra si es superadmin

    $query .= " ORDER BY c.fecha_creacion DESC";

    $stmt = $conn->prepare($query);

    if ($user_role !== 'superadmin') {
        $stmt->bindParam(":uid", $user_id);
        if ($user_org) {
            $stmt->bindParam(":org", $user_org);
        }
    }

    $stmt->execute();

    $num = $stmt->rowCount();
    $creds_arr = array();
    $creds_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Decodificar caracteres especiales por si acaso
        $row['plataforma'] = html_entity_decode($row['plataforma']);
        $row['usuario'] = html_entity_decode($row['usuario']);
        // Los nuevos campos vendrán automáticamente en $row por el SELECT c.*
        array_push($creds_arr["records"], $row);
    }

    http_response_code(200);
    echo json_encode($creds_arr);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Error al leer credenciales."));
}
?>