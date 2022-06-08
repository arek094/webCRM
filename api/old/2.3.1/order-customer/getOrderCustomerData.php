<?php
require_once '../function.php';
require_once '../config.php';
$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;
$id = $_POST['id'] ?? NULL;
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


switch ($source_data) {
    
    
    case 't_zam_nag_odb':
        $output = GetDataQuery('SELECT * FROM t_zam_nag_odb'/* WHERE zam_nag_dost_id='.$id.'' */,$uzytkownik_id);
        break;                   
    default:
        $output = array('error'  => true,'message' => 'Brak danych.');
        break;
} 

echo json_encode($output);

