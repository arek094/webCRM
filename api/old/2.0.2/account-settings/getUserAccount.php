<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL ;

if (isset($uzytkownik_id)){

    $query="SELECT uzytkownik_id,nazwa_uzytkownika,imie,nazwisko,email,kontrahent_nazwa,firma,jezyk FROM k_uzytkownicy_szczegoly WHERE uzytkownik_id='$uzytkownik_id'";
    $result=mysqli_fetch_array(mysqli_query($mysqli,$query),MYSQLI_ASSOC);

    if(isset($result)){
        $output = array('error'  => false,'message' => 'Prawidłowo przesłano dane.','data'=> $result);
    } else {
        $output = array('error'  => false,'message' => 'Błąd podczas wykonywania zapytania.');
    }

} else {
    $output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);



