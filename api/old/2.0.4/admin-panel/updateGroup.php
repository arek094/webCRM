<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$grupa_id = $_GET['grupa_id'] ?? NULL;
$grupa_nazwa = json_decode(file_get_contents("php://input"));


if(isset($grupa_id)){
	$grupa_nazwa = mysqli_real_escape_string($mysqli, $grupa_nazwa->grupa_nazwa);
	$query = "UPDATE t_grupy SET grupa_nazwa='$grupa_nazwa' WHERE grupa_id='$grupa_id'"; 
	$result = mysqli_query($mysqli, $query);

	if(isset($result)){
		$output = array('error'  => false,'message' => 'Pomyślnie zaktualizowano grupę.');
	} else {
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
	}
	
} else{
	$output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);