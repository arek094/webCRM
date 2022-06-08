<?php
require_once '../function.php';
require_once '../config.php';
$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;
$id = $_POST['id'] ?? NULL;
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


switch ($source_data) {
    case 'k_zam_nag_odb':
        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT kontrahent_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
        $kontrahent_id = $row["kontrahent_id"] ?? NULL;

       // echo json_encode($id);

        if($kontrahent_id == 0){
            $output = GetDataQuery('SELECT * from k_zam_nag_odb  WHERE operacja_id='.$id.'',$uzytkownik_id);   
        }
        else {
            $output = GetDataQuery('SELECT * from k_zam_nag_odb  WHERE operacja_id='.$id.' AND kontrahent_id='.$kontrahent_id.'',$uzytkownik_id); 
        }

        break; 

    case 'k_zam_poz_odb':
        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT kontrahent_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
        $kontrahent_id = $row["kontrahent_id"] ?? NULL;

       //  echo json_encode($id);

        if($kontrahent_id == 0){
          $output = GetDataQuery('SELECT * from k_zam_poz_odb  WHERE zam_nag_odb_id='.$id.'',$uzytkownik_id);   
         //  $output = GetDataQuery('SELECT * from k_zam_poz_odb  WHERE zam_nag_odb_id=110',$uzytkownik_id);   
        }
        else {
            $output = GetDataQuery('SELECT * from k_zam_poz_odb  WHERE zam_nag_odb_id='.$id.' AND kontrahent_id='.$kontrahent_id.'',$uzytkownik_id); 
        }

        break;     
   
    default:
        $output = array('error'  => true,'message' => 'Brak danych. ' .$id.' - ',$uzytkownik_id);
        break;
} 

echo json_encode($output);

