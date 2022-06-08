<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$user = json_decode(file_get_contents("php://input"));


if(isset($user)){
    $imie = mysqli_real_escape_string($mysqli, $user->imie);
    $nazwisko = mysqli_real_escape_string($mysqli, $user->nazwisko);
    $nazwa_uzytkownika = mysqli_real_escape_string($mysqli, $user->nazwa_uzytkownika);
    $firma = mysqli_real_escape_string($mysqli, $user->firma);
    $email = mysqli_real_escape_string($mysqli, $user->email);
    $grupa_id = mysqli_real_escape_string($mysqli, $user->grupa_id);
    $kontrahent_id = mysqli_real_escape_string($mysqli, $user->kontrahent_id);
    $haslo = mysqli_real_escape_string($mysqli, password_hash($user->haslo, PASSWORD_BCRYPT));
    $czy_aktywny = mysqli_real_escape_string($mysqli, $user->czy_aktywny);


	$query = "INSERT INTO t_uzytkownicy(nazwa_uzytkownika,haslo,imie,nazwisko,email,firma,grupa_id,kontrahent_id,czy_aktywny) 
            VALUES ('$nazwa_uzytkownika','$haslo','$imie','$nazwisko','$email','$firma','$grupa_id','$kontrahent_id','$czy_aktywny')"; 
    $result = mysqli_query($mysqli, $query);

	if (isset($result)){
		$output = array('error'  => false,'message' => 'Pomyślnie dodano użutkownika.');
	} else {
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
	}	
	
} else
{
		$output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);