<?php
require_once '../function.php';
require_once '../config.php';
$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;
$id = $_POST['id'] ?? NULL;
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


switch ($source_data) {
    case 'k_uzytkownicy_szczegoly':
        $output = GetDataQuery('SELECT * FROM k_uzytkownicy_szczegoly',$uzytkownik_id);
        break;     
    case 't_grupy':
        $output = GetDataQuery('SELECT * FROM t_grupy',$uzytkownik_id);
        break;   
    case 't_kontrahenci':
        $output = GetDataQuery('SELECT * FROM t_kontrahenci',$uzytkownik_id);
        break;   
    case 't_moduly_uprawnienia_obiekt_zapytanie':
        $output = GetDataQueryPosition('SELECT * FROM t_moduly','SELECT t_uprawnienia_obiekt.modul_id,t_uprawnienia_obiekt.obiekt_id,t_uprawnienia_obiekt.obiekt_nazwa, 
                                                                    CASE WHEN t_uprawnienia_users.obiekt_id IS NULL THEN false ELSE true END as dostep FROM t_uprawnienia_obiekt
                                                                    LEFT JOIN t_uprawnienia_users ON t_uprawnienia_obiekt.obiekt_id = t_uprawnienia_users.obiekt_id 
                                                                    AND t_uprawnienia_users.grupa_id='.$id.' WHERE modul_id=','modul_id',$uzytkownik_id);
        break;         
    default:
        $output = array('error'  => true,'message' => 'Brak danych.');
        break;
} 

echo json_encode($output);

