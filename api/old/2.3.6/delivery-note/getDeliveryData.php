<?php
require_once '../function.php';
require_once '../config.php';
$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;
$id = $_POST['id'] ?? NULL;
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


switch ($source_data) {
    case 'k_wydanie_nag_raport_k_wydanie_poz_raport':
        $output = GetDataQueryPosition('SELECT * FROM k_wydanie_nag_raport WHERE wydanie_nag_dost_id='.$id.'','SELECT * FROM k_wydanie_poz_raport WHERE wydanie_nag_dost_id=','wydanie_nag_dost_id',$uzytkownik_id);
        break;
    case 'k_wydanie_nag_raport_k_wydanie_poz_raport_beztury':
        $output = GetDataQueryPosition('SELECT * FROM k_wydanie_nag_raport WHERE wydanie_nag_dost_id='.$id.'','SELECT * FROM k_wydanie_poz_raport_beztury WHERE wydanie_nag_dost_id=','wydanie_nag_dost_id',$uzytkownik_id);
        break;           
    case 't_wydanie_nag_dost':
        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT kontrahent_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
        $kontrahent_id = $row["kontrahent_id"] ?? NULL;

        if($kontrahent_id == 0){
            $output = GetDataQuery('SELECT t_wydanie_nag_dost.wydanie_nag_dost_id,t_wydanie_nag_dost.uzytkownik_id_utworzenia,numer,t_wydanie_nag_dost.data_utworzenia,t_kontrahenci.kontrahent_nazwa ,t_wydania_status.status_nazwa,t_wydania_status.status_id
                                    FROM t_wydanie_nag_dost 
                                    INNER JOIN t_wydania_status ON t_wydania_status.status_id = t_wydanie_nag_dost.status_id
                                    INNER JOIN t_uzytkownicy ON t_uzytkownicy.uzytkownik_id = t_wydanie_nag_dost.uzytkownik_id_utworzenia
                                    INNER JOIN t_kontrahenci ON t_kontrahenci.kontrahent_id = t_uzytkownicy.kontrahent_id',$uzytkownik_id);   
        }
        else {
            $output = GetDataQuery('SELECT t_wydanie_nag_dost.wydanie_nag_dost_id,t_wydanie_nag_dost.uzytkownik_id_utworzenia,numer,t_wydanie_nag_dost.data_utworzenia,t_kontrahenci.kontrahent_nazwa,t_wydania_status.status_nazwa,t_wydania_status.status_id
                                    FROM t_wydanie_nag_dost 
                                    INNER JOIN t_wydania_status ON t_wydania_status.status_id = t_wydanie_nag_dost.status_id
                                    INNER JOIN t_uzytkownicy ON t_uzytkownicy.uzytkownik_id = t_wydanie_nag_dost.uzytkownik_id_utworzenia
                                    INNER JOIN t_kontrahenci ON t_kontrahenci.kontrahent_id = t_uzytkownicy.kontrahent_id WHERE t_wydanie_nag_dost.uzytkownik_id_utworzenia='.$uzytkownik_id.'',$uzytkownik_id); 
        }
       
        break;
    case 't_wydanie_nag_dost_temp':
        $output = GetDataQuery('SELECT * FROM t_wydanie_nag_dost_temp WHERE uzytkownik_id_utworzenia='.$uzytkownik_id.'',$uzytkownik_id);
        break;   
    case 'k_wydanie_poz_dost_szczegoly':
        $output = GetDataQuery('SELECT * FROM k_wydanie_poz_dost_szczegoly WHERE wydanie_nag_dost_id='.$id.'',$uzytkownik_id);
        break;
    case 't_wydanie_nag_dost_temp_k_wydanie_poz_dost_temp_szczegoly':
        //$output = GetDataQuery('SELECT * FROM k_wydanie_poz_dost_temp_szczegoly WHERE wydanie_nag_dost_id='.$id.'',$uzytkownik_id);
        $output = GetDataQueryPosition('SELECT * FROM t_wydanie_nag_dost_temp WHERE wydanie_nag_dost_id='.$id.'','SELECT * FROM k_wydanie_poz_dost_temp_szczegoly WHERE wydanie_nag_dost_id=','wydanie_nag_dost_id',$uzytkownik_id);
        break;  
    case 'k_wydanie_eksport_csv':
        $output = GetDataQuery('SELECT * FROM k_wydanie_eksport_csv WHERE wydanie_nag_dost_id='.$id.'',$uzytkownik_id);
        break;     
    case 'k_wydanie_eksport_csvIN':
        $id = implode(",", $id);
        $output = GetDataQuery('SELECT * FROM k_wydanie_eksport_csv WHERE wydanie_nag_dost_id IN ('.$id.')',$uzytkownik_id);
        break;        
    default:
        $output = array('error'  => true,'message' => 'Brak danych.');
        break;
} 

echo json_encode($output);

