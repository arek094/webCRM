<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
/*
Funkcja wysyłania maili poprzez tabelę - t_wysylka_mail

*/

function insertEmailGroup($tytul,$tresc,$grupa,$uzytkownik_id) {

    require_once '../config.php';
    require_once '../function.php';

    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($mysqli, "utf8");

    $data_query = GetDataQuery('SELECT imie, nazwisko,email FROM t_uzytkownicy where grupa_id='.$grupa.'',$uzytkownik_id);
    $data_query=$data_query['data'];

    $i = 0;
    $query_value = [];

    foreach ($data_query as $row) 
    { 
        
        $query_value[$i] = ('('.' " '.$tytul.' " '.','.' " '.$tresc.' " '.','.' " '.$row['email'].' " '.','.' " '.$row['imie'].' '.$row['nazwisko'].' " '.')');
        $query_string_insert = implode(",", $query_value);
        $i++;
    }

    $query = "INSERT INTO t_wysylka_mail (tytul,tresc,email,nazwisko_imie) VALUES $query_string_insert";
    $result = mysqli_query($mysqli, $query);

    if(isset($result)){
        return true;
    } else {
        return false;
    }

}