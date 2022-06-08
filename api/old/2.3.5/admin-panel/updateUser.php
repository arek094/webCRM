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

if(isset($user)) {
    $imie = mysqli_real_escape_string($mysqli, $user->imie);
    $nazwisko = mysqli_real_escape_string($mysqli, $user->nazwisko);
    $nazwa_uzytkownika = mysqli_real_escape_string($mysqli, $user->nazwa_uzytkownika);
    $firma = mysqli_real_escape_string($mysqli, $user->firma);
    $email = mysqli_real_escape_string($mysqli, $user->email);
    $grupa_id = mysqli_real_escape_string($mysqli, $user->grupa_id);
    $kontrahent_id = mysqli_real_escape_string($mysqli, $user->kontrahent_id);
    $czy_aktywny = mysqli_real_escape_string($mysqli, $user->czy_aktywny);

	     
	if(strlen(mysqli_real_escape_string($mysqli,$user->haslo))>2){
		$haslo = mysqli_real_escape_string($mysqli, password_hash($user->haslo, PASSWORD_BCRYPT));
		$u_haslo = "haslo='$haslo', ";
	}	else $u_haslo="";

	$query = "UPDATE t_uzytkownicy 
				SET imie='$imie',nazwisko='$nazwisko',nazwa_uzytkownika='$nazwa_uzytkownika',
				firma='$firma',email='$email',grupa_id='$grupa_id',kontrahent_id='$kontrahent_id',$u_haslo czy_aktywny='$czy_aktywny'  
				WHERE uzytkownik_id='$uzytkownik_id'";
	if(mysqli_query($mysqli, $query)) {

		$output = array('error'  => false,'message' => 'Użytkownik został pomyślnie zaktualizowany.');
		
	}
	else {
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
	}

} else {
	$output = array('error'  => true,'message' => 'Brak danych.');
}


echo json_encode($output);
	







