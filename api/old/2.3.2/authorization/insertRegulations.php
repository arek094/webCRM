<?php
header("Access-mysqlitrol-Allow-Origin: *");
header("mysqlitent-Type: application/json");
header("Access-mysqlitrol-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-mysqlitrol-Allow-Headers: Origin, X-Requested-With, mysqlitent-Type, Accept");
include('../functions/f_insert_log_user.php');
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_POST['uzytkownik_id'] ?? NULL;
$regulation = $_POST['regulation'] ?? NULL;
$returnHtml = $_POST['returnHtml'] ?? NULL;

if(isset($regulation) AND isset($uzytkownik_id)) {
	$dane_osobowe_dodatkowe = $regulation["dane_osobowe_dodatkowe"];
	$regulamin_dodatkowy_dostawca = $regulation["regulamin_dodatkowy_dostawca"];
	$regulamin_dodatkowy_odbiorca = $regulation["regulamin_dodatkowy_odbiorca"];

	$query = "UPDATE t_uzytkownicy SET dane_osobowe_panel_uzytk='$dane_osobowe_dodatkowe', 
			regulamin_panel_uzytk=CASE WHEN '$regulamin_dodatkowy_dostawca' = '' THEN '$regulamin_dodatkowy_odbiorca' ELSE '$regulamin_dodatkowy_dostawca' END  
			WHERE uzytkownik_id='$uzytkownik_id'";
	
	if (mysqli_query($mysqli, $query)){
		
		$query_log = preg_replace("/[\n\r\t']/","",$query); 
		insertLogUser($uzytkownik_id,4,'Akceptacja polityki','Akceptacja',$query_log,$returnHtml);

		$output = array('error'  => false,'message' => 'Akceptacja warunków polityki przebiegła pomyślnie.');
	}
	else { 
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas rejestracji, prosimy spróbować później.');
	}
}
else {
	$output = array('error'  => true,'message' => 'Brak danych.');
}


echo json_encode($output);