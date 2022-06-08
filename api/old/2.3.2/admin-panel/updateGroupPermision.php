<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$permissions = json_decode(file_get_contents("php://input"));
$grupa_id = $_GET['grupa_id'] ?? NULL;
$modul_id = $_GET['modul_id'] ?? NULL;

if(isset($grupa_id) OR isset($modul_id)){
    $query = "DELETE t_uprawnienia_users FROM t_uprawnienia_users 
    JOIN t_uprawnienia_obiekt ON t_uprawnienia_users.obiekt_id = t_uprawnienia_obiekt.obiekt_id
    WHERE t_uprawnienia_obiekt.modul_id = '$modul_id' AND t_uprawnienia_users.grupa_id='$grupa_id'";
    $result=mysqli_query($mysqli,$query);

    $licznik = count($permissions);
    for($i=0; $i<$licznik; $i++){
    $query_permission = "INSERT INTO t_uprawnienia_users (obiekt_id,grupa_id) VALUES ('$permissions[$i]','$grupa_id')";
    $result_permission=mysqli_query($mysqli,$query_permission);
    }

    if (isset($result) OR isset($result_permission)){
        $output = array('error'  => false,'message' => 'Pomyślnie zaktualizowano uprawnienia.');
    }  else {
        $output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
    }
} else{
        $output = array('error'  => true,'message' => 'Brak danych.');
}



echo json_encode($output);

	







