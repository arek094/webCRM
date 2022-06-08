<?php
require_once '../function.php';
require_once '../config.php';

$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;
$id = $_POST['id'] ?? NULL;
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

switch ($source_data) {
    case 'k_zam_nag_dost_lista':
        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT kontrahent_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
        $kontrahent_id = $row["kontrahent_id"] ?? NULL;

        if($kontrahent_id == 0 OR $kontrahent_id == NULL){
            $output = GetDataQuery('SELECT * from k_zam_nag_dost_lista WHERE status_id<>1 AND operacja_id='.$id.'',$uzytkownik_id);   
        }
        else {
            $output = GetDataQuery('SELECT * from k_zam_nag_dost_lista WHERE operacja_id='.$id.' AND kontrahent_id='.$kontrahent_id.'',$uzytkownik_id);  
        }        
        break;         
    case 'k_zam_poz_dost_szczegoly':
        $output = GetDataQuery('SELECT * FROM k_zam_poz_dost_szczegoly WHERE zam_nag_dost_id='.$id.'',$uzytkownik_id);
        break;  
    case 't_typ_dok_erp_zam':
        $output = GetDataQuery('SELECT * from t_typ_dok_erp_zam',$uzytkownik_id);
        break; 
    case 'k_zam_nag_dost_lista_k_zam_poz_dost_szczegoly':
            $output = GetDataQueryPosition('SELECT * FROM k_zam_nag_dost_lista WHERE zam_nag_dost_id='.$id.'','SELECT * FROM k_zam_poz_dost_szczegoly WHERE zam_nag_dost_id=','zam_nag_dost_id',$uzytkownik_id);
            break;      
    default:
        $output = array('error'  => true,'message' => 'Brak danych.');
        break;
} 

echo json_encode($output);

