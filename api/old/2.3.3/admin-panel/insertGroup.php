<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$userGroups = json_decode(file_get_contents("php://input"));


if(isset($userGroups)){
	$grupa_nazwa = mysqli_real_escape_string($mysqli, $userGroups->grupa_nazwa);

	$query = "INSERT INTO t_grupy(grupa_nazwa) VALUES ('$grupa_nazwa')"; 
	$result= mysqli_query($mysqli, $query);

	if (isset($result)){
		$output = array('error'  => false,'message' => 'Pomyślnie dodano grupę.');
	} else {
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
	}
	
} else
{
		$output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);