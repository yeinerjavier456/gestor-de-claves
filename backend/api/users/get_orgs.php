<?php
// backend/api/users/get_orgs.php
include_once '../cors.php';
include_once '../../config.php';
require '../auth_check.php'; // Verifica sesión

header('Content-Type: application/json');

try {
    // Obtener organizaciones asociadas al usuario actual
    // Join con la tabla de organizaciones para obtener nombres
    $query = "
        SELECT o.id, o.nombre, o.descripcion 
        FROM organizaciones o
        INNER JOIN usuarios_organizaciones uo ON o.id = uo.id_organizacion
        WHERE uo.id_usuario = :uid
    ";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':uid', $_SESSION['user_id']);
    $stmt->execute();

    $orgs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($orgs);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>