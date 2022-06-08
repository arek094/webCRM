<?php
header("Access-mysqlitrol-Allow-Origin: *");
header("mysqlitent-Type: application/json");
header("Access-mysqlitrol-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-mysqlitrol-Allow-Headers: Origin, X-Requested-With, mysqlitent-Type, Accept");
require_once '../config.php';
include('../functions/f_insert_email.php');

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$formHelpMessage = json_decode(file_get_contents("php://input"));
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;

if(isset($formHelpMessage)) {
	$temat = mysqli_real_escape_string($mysqli, $formHelpMessage->temat);
	$wiadomosc = mysqli_real_escape_string($mysqli, $formHelpMessage->wiadomosc);

    $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT email,imie,nazwisko FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC); 
    $email = $row["email"];
    $imie = $row["imie"];
    $nazwisko = $row["nazwisko"];

    if(insertEmail($temat,$wiadomosc,$email,$nazwisko.' '.$imie) == true)
    {
        $output = array('error'  => false,'message' => 'Wiadomość została wysłana.');
    }
    else
    {
	    $output = array('error'  => true,'message' => 'Błąd podczas wysyłania wiadomości.');
    }
	
} else {
    $output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);
