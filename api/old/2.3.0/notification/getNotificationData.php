<?php
require_once '../function.php';
require_once '../config.php';
$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;
$id = $_POST['id'] ?? NULL;
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


switch ($source_data) {
    case 'k_zgloszenia':
        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT grupa_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
        $grupa_id = $row["grupa_id"];

        if($grupa_id == 1) {
            $output = GetDataQuery('SELECT * FROM k_zgloszenia',$uzytkownik_id);
        } else {
            $output = GetDataQuery('SELECT * FROM k_zgloszenia WHERE uzytkownik_id_utworzenia='.$uzytkownik_id.'',$uzytkownik_id);
        }
 
        break;           
    default:
        $output = array('error'  => true,'message' => 'Brak danych.');
        break;
} 

echo json_encode($output);

