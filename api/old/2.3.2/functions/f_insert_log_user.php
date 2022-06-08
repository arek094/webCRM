<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
/*
Funkcja rejestrowania zdarzeń akcji uzytkowników - t_uzytkownicy_rejestr_log

Akcje
1 - Rejestracja
2 - Weryfikacja adresu e-mail
3 - Logowanie
4 - Wylogowanie
5 - Przypomnienie hasła
6 - Reset hasła/Zmiana hasła
*/

function insertLogUser($uzytkownik_id,$akcja_id,$akcja_nazwa,$akcja_opis,$zapytanie,$html) {

    require_once '../config.php';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($mysqli, "utf8");

    $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT nazwa_uzytkownika FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
    $nazwa_uzytkownika = $row["nazwa_uzytkownika"];

    $query = "INSERT INTO t_uzytkownicy_rejestr_log (uzytkownik_id,nazwa_uzytkownika,akcja_id,akcja_nazwa,akcja_opis,zapytanie,html) VALUES ('$uzytkownik_id','$nazwa_uzytkownika','$akcja_id','$akcja_nazwa','$akcja_opis','$zapytanie','$html')";
    $result = mysqli_query($mysqli, $query);

}