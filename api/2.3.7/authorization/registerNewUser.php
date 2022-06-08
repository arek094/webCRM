<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include('../sendMail.php');
include('../functions/f_insert_email.php');
include('../functions/f_insert_log_user.php');
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$_POST = json_decode(file_get_contents('php://input'),true);
$user = $_POST['user'] ?? NULL;
$businessAgreement = $_POST['businessAgreement'] ?? NULL;
$token = bin2hex(random_bytes(16));

if(isset($user)) {
	$imie = mysqli_real_escape_string($mysqli, $user["imie"]);
	$nazwisko = mysqli_real_escape_string($mysqli, $user["nazwisko"]);
	$nazwa_uzytkownika = mysqli_real_escape_string($mysqli, $user["nazwa_uzytkownika"]);
	$email = mysqli_real_escape_string($mysqli, $user["email"]);
	$firma = mysqli_real_escape_string($mysqli, $user["firma"]);
	$jezyk = mysqli_real_escape_string($mysqli, $user["jezyk"]);
	$haslo = mysqli_real_escape_string($mysqli, password_hash($user["haslo"], PASSWORD_BCRYPT));
	$polityka_cookie = mysqli_real_escape_string($mysqli, $user["polityka_cookie"]);
	$polityka_prywatnosci = mysqli_real_escape_string($mysqli, $user["polityka_prywatnosci"]);
	$polityka_przerw_dostepnosci = mysqli_real_escape_string($mysqli, $user["polityka_przerw_dostepnosci"]);
	$info_administratora = mysqli_real_escape_string($mysqli, $user["info_administratora"]);
	$info_przetwarzania_danych = mysqli_real_escape_string($mysqli, $user["info_przetwarzania_danych"]);


	$query = "INSERT INTO t_uzytkownicy(nazwa_uzytkownika,haslo,imie,nazwisko,email,firma,jezyk,token,polityka_cookie,polityka_prywatnosci,polityka_przerw_dostepnosci,info_administratora,info_przetwarzania_danych) 
			VALUES ('$nazwa_uzytkownika','$haslo','$imie','$nazwisko','$email','$firma','$jezyk','$token','$polityka_cookie','$polityka_prywatnosci','$polityka_przerw_dostepnosci','$info_administratora','$info_przetwarzania_danych')"; 


	
	if (mysqli_query($mysqli, $query)){
		//Dane do maila
		$id=mysqli_insert_id($mysqli);

		$email_adress = $email;
		$subject = "Weryfikacja adresu e-mail";
		$message=   link_page.'verify-email/'.$id.'/'.$token;
		$name_email_adress= $nazwisko.' '.$imie;
				
		$query_log = preg_replace("/[\n\r\t']/","",$query); 
		insertLogUser($id,1,'Rejestracja','Akceptacja: polityka_cookie,polityka_prywatnosci,polityka_przerw_dostepnosci,info_administratora,info_przetwarzania_danych',$query_log,json_encode($businessAgreement));
		insertEmail($subject,$message,$email_adress,$name_email_adress);

		$output = array('error'  => false,'message' => 'Dziękujemy za rejestracje. Na twój adres e-mail został przesłany link aktywacyjny w celu potwierdzenia adresu e-mail.');
	}
	else { 
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas rejestracji, prosimy spróbować później.');
	}
}
else {
	$output = array('error'  => true,'message' => 'Brak danych.');
}


echo json_encode($output);