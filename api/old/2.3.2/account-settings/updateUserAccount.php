<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$user = json_decode(file_get_contents("php://input"));
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;

if(isset($user) OR isset($uzytkownik_id)){
    $imie = mysqli_real_escape_string($mysqli, $user->imie);
    $nazwisko = mysqli_real_escape_string($mysqli, $user->nazwisko);
    $nazwa_uzytkownika = mysqli_real_escape_string($mysqli, $user->nazwa_uzytkownika);
    $firma = mysqli_real_escape_string($mysqli, $user->firma);
	$email = mysqli_real_escape_string($mysqli, $user->email);
	$jezyk = mysqli_real_escape_string($mysqli, $user->jezyk);

	$query = "UPDATE t_uzytkownicy 
				SET imie='$imie',nazwisko='$nazwisko',nazwa_uzytkownika='$nazwa_uzytkownika',
				firma='$firma', email='$email',jezyk='$jezyk'
				WHERE uzytkownik_id='$uzytkownik_id'";
	$result = mysqli_query($mysqli, $query);		

	if(isset($result)) {
		$output = array('error'  => false,'message' => 'Profil został pomyślnie zaktualizowany.');	
	}
	else {
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
	}

} else {
	$output = array('error'  => true,'message' => 'Brak danych.');
}


echo json_encode($output);
	







