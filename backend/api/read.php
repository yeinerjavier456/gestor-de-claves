<?php
// backend/api/read.php
include_once 'cors.php';
include_once '../config.php';
require 'auth_check.php';

header('Content-Type: application/json');

// Parámetros de filtro
$scope = isset($_GET['scope']) ? $_GET['scope'] : 'personal'; // 'personal' o 'org'
$org_id = isset($_GET['org_id']) ? intval($_GET['org_id']) : 0;
$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'];

try {
    $sql = "SELECT c.*, u.nombre_completo as propietario 
            FROM credenciales c 
            LEFT JOIN usuarios u ON c.id_usuario = u.id 
            WHERE 1=1";

    if ($user_role === 'superadmin') {
        // Superadmin ve todo si no filtra, o puede filtrar por org
        if ($scope === 'personal') {
            $sql .= " AND c.id_usuario = :uid";
        } elseif ($scope === 'org' && $org_id > 0) {
            $sql .= " AND c.id_organizacion = :oid";
        }
    } else {
        // Usuario Normal
        if ($scope === 'personal') {
            // Solo sus credenciales personales (que no estén asignadas a una org, o explícitamente suyas)
            // Asumiremos personales = creadas por él
            $sql .= " AND c.id_usuario = :uid";
        } elseif ($scope === 'org' && $org_id > 0) {
            // Verificar que el usuario pertenezca a esa organización
            $check_sql = "SELECT 1 FROM usuarios_organizaciones WHERE id_usuario = :uid AND id_organizacion = :oid";
            $check_stmt = $conn->prepare($check_sql);
            $check_stmt->bindParam(':uid', $user_id);
            $check_stmt->bindParam(':oid', $org_id);
            $check_stmt->execute();

            if ($check_stmt->rowCount() > 0) {
                // Pertenece, mostrar credenciales de la org
                $sql .= " AND c.id_organizacion = :oid";
            } else {
                // No pertenece, devolver vacío o error (vacío por seguridad)
                echo json_encode([]);
                exit;
            }
        } else {
            // Default fallback: Solo personales
            $sql .= " AND c.id_usuario = :uid";
        }
    }

    $sql .= " ORDER BY c.plataforma ASC";

    $stmt = $conn->prepare($sql);

    if (strpos($sql, ':uid') !== false) {
        $stmt->bindParam(':uid', $user_id);
    }
    if (strpos($sql, ':oid') !== false) {
        $stmt->bindParam(':oid', $org_id);
    }

    $stmt->execute();
    $credentials = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($credentials);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>