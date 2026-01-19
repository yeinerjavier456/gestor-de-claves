<?php
// backend/api/users/list.php
// Listar usuarios

include_once '../../config.php';
include_once '../cors.php';
include_once '../auth/admin_check.php';

try {
    // Traer info de organizacion tambien
    $query = "SELECT u.id, u.nombre_completo, u.email, u.rol, u.limite_credenciales, u.id_organizacion, o.nombre as nombre_organizacion 
              FROM usuarios u 
              LEFT JOIN organizaciones o ON u.id_organizacion = o.id 
              ORDER BY u.id DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $users_arr = array();
    $users_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // NO enviamos el password hash
        array_push($users_arr["records"], $row);
    }

    http_response_code(200);
    echo json_encode($users_arr);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Error al listar usuarios."));
}
?>