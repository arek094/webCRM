<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
/*
Funkcja tworzenia logów

*/

function insertLog($identyfikator,$obiekt,$uzytkownik_id,$akcja,$akcja_opis) {

    require_once '../config.php';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($mysqli, "utf8");

    $query = "INSERT INTO t_historia_log (identyfikator,obiekt,uzytkownik_id,akcja,akcja_opis) VALUES ('$identyfikator','$obiekt','$uzytkownik_id','$akcja','$akcja_opis')";
    mysqli_query($mysqli, $query);


}