<?php
// backend/config.sample.php
// Copia este archivo a config.php y pon tus credenciales reales

$host = 'localhost';
$db_name = 'u123456789_mi_base_datos';
$username = 'u123456789_mi_usuario';
$password = 'PonTuPasswordAqui';

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8");
} catch (PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
}
?>