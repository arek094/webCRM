<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$change_password = json_decode(file_get_contents("php://input"));
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;

if(isset($change_password) ) 	{
    $stare_haslo = mysqli_real_escape_string($mysqli, $change_password->stare_haslo);
    $nowe_haslo = mysqli_real_escape_string($mysqli, $change_password->nowe_haslo);
    
    $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT haslo FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
    $haslo = $row["haslo"];
    
    if (password_verify($stare_haslo, $haslo))
    {
        $nowe_haslo_hash = mysqli_real_escape_string($mysqli, password_hash($change_password->nowe_haslo, PASSWORD_BCRYPT));
        $query = "UPDATE t_uzytkownicy SET haslo='$nowe_haslo_hash', zmiana_hasla=NOW() WHERE uzytkownik_id='$uzytkownik_id'";
        mysqli_query($mysqli, $query);

        $output = array('error'  => false,'message' => 'Hasło zostało zmienione');
       
    }
    else
    {
        $output = array('error'  => true,'message' => 'Nieprawidłowe hasło');
    }

} else {
    $output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);






