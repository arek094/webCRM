<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
/*
Funkcja wysyłania maili poprzez tabelę - t_wysylka_mail

*/

function insertEmail($tytul,$tresc,$email,$nazwisko_imie) {

    require_once '../config.php';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($mysqli, "utf8");

    $query = "INSERT INTO t_wysylka_mail (tytul,tresc,email,nazwisko_imie) VALUES ('$tytul','$tresc','$email','$nazwisko_imie')";
    $result = mysqli_query($mysqli, $query);

    if(isset($result)){
        return true;
    } else {
        return false;
    }

}