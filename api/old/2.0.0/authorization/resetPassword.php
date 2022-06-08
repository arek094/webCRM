<?php
header("Access-Control-Allow-Origin: https://localhost:4200");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Credentials: true");
include('../functions/f_insert_log_user.php');
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$_POST = json_decode(file_get_contents('php://input'),true);
$haslo = password_hash($_POST['haslo'], PASSWORD_BCRYPT);
$token = $_POST['token'] ?? NULL;
$uzytkownik_id = $_POST['uzytkownik_id'] ?? NULL;

$query = "UPDATE t_uzytkownicy SET haslo='$haslo',token=NULL,zmiana_hasla=NOW() WHERE uzytkownik_id='$uzytkownik_id' AND token='$token'";

if(mysqli_num_rows(mysqli_query($mysqli,"SELECT uzytkownik_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'")) > 0) {
    mysqli_query($mysqli,$query);

    $query_log = preg_replace("/[\n\r\t']/","",$query); 
    insertLogUser($uzytkownik_id,6,'Reset hasła/Zmiana hasła','Reset hasła/Zmiana hasła',$query_log,null);
    $output = array('error'  => false,'message' => 'Hasło zostało pomyślnie zmienione.');
}
else {
    $output = array('error'  => false,'message' => 'Wystąpił błąd podczas operacji zmiany hasła, proszę spróbować później.');
}

echo json_encode($output);

