<?php
// backend/install_admin.php
// Ejecuta este script para crear o reparar el usuario superadmin

include_once 'api/cors.php'; // Para ver output en navegador sin problemas
include_once 'config.php';

$email = 'admin@admin.com';
$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);
$nombre = 'Super Administrador';
$rol = 'superadmin';
$limite = -1; // Infinito

try {
    // Verificar si ya existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email = :email");
    $check->bindParam(":email", $email);
    $check->execute();

    if ($check->rowCount() == 0) {
        // Crear nuevo
        $query = "INSERT INTO usuarios (nombre_completo, email, password, rol, limite_credenciales) VALUES (:nombre, :email, :pass, :rol, :limite)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":pass", $hash);
        $stmt->bindParam(":rol", $rol);
        $stmt->bindParam(":limite", $limite);

        if ($stmt->execute()) {
            echo "<h1>Éxito</h1><p>Super Admin creado.</p>";
            echo "User: $email<br>Pass: $password";
        } else {
            echo "Error al crear admin.";
        }
    } else {
        // Actualizar contraseña existente (FIX para error de login)
        $query = "UPDATE usuarios SET password = :pass, rol = :rol WHERE email = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":pass", $hash);
        $stmt->bindParam(":rol", $rol);
        $stmt->bindParam(":email", $email);

        if ($stmt->execute()) {
            echo "<h1>Reparado</h1><p>El usuario admin ya existía. Se ha actualizado su contraseña correctamente.</p>";
            echo "User: $email<br>Pass: $password";
        } else {
            echo "Error al actualizar.";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>