<?php
// backend/api/organizations/manage.php

include_once '../../config.php';
include_once '../cors.php';
include_once '../auth/admin_check.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

try {
    if ($method == 'GET') {
        $query = "SELECT * FROM organizaciones ORDER BY id DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $orgs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array("records" => $orgs));

    } elseif ($method == 'POST') {
        if (!empty($data->nombre)) {
            $query = "INSERT INTO organizaciones SET nombre=:nombre, descripcion=:desc";
            $stmt = $conn->prepare($query);
            $nombre = htmlspecialchars(strip_tags($data->nombre));
            $desc = !empty($data->descripcion) ? htmlspecialchars(strip_tags($data->descripcion)) : '';
            $stmt->bindParam(":nombre", $nombre);
            $stmt->bindParam(":desc", $desc);
            $stmt->execute();
            echo json_encode(array("message" => "Creada."));
        }

    } elseif ($method == 'PUT') {
        if (!empty($data->id) && !empty($data->nombre)) {
            $query = "UPDATE organizaciones SET nombre=:nombre, descripcion=:desc WHERE id=:id";
            $stmt = $conn->prepare($query);
            $nombre = htmlspecialchars(strip_tags($data->nombre));
            $desc = !empty($data->descripcion) ? htmlspecialchars(strip_tags($data->descripcion)) : '';
            $stmt->bindParam(":id", $data->id);
            $stmt->bindParam(":nombre", $nombre);
            $stmt->bindParam(":desc", $desc);
            $stmt->execute();
            echo json_encode(array("message" => "Actualizada."));
        }

    } elseif ($method == 'DELETE') {
        // DELETE via POST method check or actual DELETE request
        // PHP //input works for PUT/DELETE too usually
        if (!empty($data->id)) {
            // Desvincular usuarios primero? O dejar NULL? Mejor NULL
            $updUsers = "UPDATE usuarios SET id_organizacion = NULL WHERE id_organizacion = :id";
            $stmtUpd = $conn->prepare($updUsers);
            $stmtUpd->bindParam(":id", $data->id);
            $stmtUpd->execute();

            // Borrar credenciales de esa org ?? O dejarlas NULL? Dejarlas NULL
            $updCreds = "UPDATE credenciales SET id_organizacion = NULL WHERE id_organizacion = :id";
            $stmtCreds = $conn->prepare($updCreds);
            $stmtCreds->bindParam(":id", $data->id);
            $stmtCreds->execute();

            $query = "DELETE FROM organizaciones WHERE id=:id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":id", $data->id);
            $stmt->execute();
            echo json_encode(array("message" => "Eliminada."));
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>