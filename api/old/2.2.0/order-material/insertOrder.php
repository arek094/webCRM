<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include("functions/generateOrder.php");

require_once '../config.php';
$con = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($con, "utf8");
$order = json_decode(file_get_contents("php://input"));

if(isset($order)){
	generateOrder($order,1);
	$output = array('error'  => false,'message' => 'Zamówienie zostało pomyślnie dodane.');
} else
{
	$output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);




