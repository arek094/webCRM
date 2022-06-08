<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$tempDelivery = json_decode(file_get_contents("php://input"));
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;

echo json_encode($tempDelivery);

function spr_ilosc_wydana($array) 
{   
    $ilosc_wydana = $array->ilosc_wydana ?? NULL ;
    if($ilosc_wydana > 0 AND $ilosc_wydana != NULL) 
       return TRUE; 
    else 
       return FALSE;  
} 

$tempDelivery = array_merge(array_filter($tempDelivery, "spr_ilosc_wydana"));

if(isset($uzytkownik_id)){
    

    $ostatni_numer = mysqli_query($mysqli,"SELECT SUBSTRING(numer, LOCATE('/',numer,4) + 10, 5) as ostatni_numer FROM t_wydanie_nag_dost WHERE SUBSTRING(numer, LOCATE('/',numer,2) + 5, 4) = YEAR(NOW()) order by SUBSTRING(numer, LOCATE('/',numer,4) + 10, 5) DESC LIMIT 1");
    $ostatni_numer_wiersz = mysqli_fetch_array($ostatni_numer,MYSQLI_ASSOC);
    $ostatni_numer_wiersz_check = isset($ostatni_numer_wiersz["ostatni_numer"]) ? $ostatni_numer_wiersz["ostatni_numer"] : 0;
    
    $numer = str_pad($ostatni_numer_wiersz_check + 1, 4, "0", STR_PAD_LEFT);
    
    $dzien = date("d");
    $miesiac = date("m");
    $rok = date("Y");
    $numer = 'WZ1'.'/'.$dzien.$miesiac.$rok.'/'.$numer;

    $wydanie_naglowek_baz = mysqli_query($mysqli,"SELECT wydanie_nag_dost_id,uzytkownik_id_utworzenia FROM t_wydanie_nag_dost_temp WHERE uzytkownik_id_utworzenia='$uzytkownik_id' LIMIT 1");
    $wydanie_naglowek_baz_wiersz = mysqli_fetch_array($wydanie_naglowek_baz,MYSQLI_ASSOC);

    if (empty($wydanie_naglowek_baz_wiersz["wydanie_nag_dost_id"])){
        $query_nag = "INSERT INTO t_wydanie_nag_dost_temp(numer,uzytkownik_id_utworzenia) VALUES ('$numer','$uzytkownik_id')"; 
        $result = mysqli_query($mysqli, $query_nag);
        
        
        
        $id=mysqli_insert_id($mysqli);
        $licznik = count($tempDelivery);
            for($i=0; $i < $licznik ; $i++)
            {
                $zam_poz_dost_id = mysqli_real_escape_string($mysqli, $tempDelivery[$i]->zam_poz_dost_id);
                $wytwor_id = mysqli_real_escape_string($mysqli, $tempDelivery[$i]->wytwor_id);
                $ilosc_wydana = mysqli_real_escape_string($mysqli, $tempDelivery[$i]->ilosc_wydana);
                $uwagi_poz = mysqli_real_escape_string($mysqli, $tempDelivery[$i]->uwagi_poz);
                $querypoz = "INSERT INTO t_wydanie_poz_dost_temp(wydanie_nag_dost_id,wytwor_id,ilosc,zam_poz_dost_id,uwagi_poz) VALUES ('$id','$wytwor_id','$ilosc_wydana','$zam_poz_dost_id','$uwagi_poz')"; 
                $result_poz = mysqli_query($mysqli, $querypoz);
            }	

            if(isset($result) AND isset($result_poz)) {
                $output = array('error'  => false,'message' => 'Pozycje zostały dodane do wydania tymczasowego.');	
            }
            else {
                $output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
            }

    } else {         
        
        $id=$wydanie_naglowek_baz_wiersz["wydanie_nag_dost_id"];
        $licznik = count($tempDelivery);


            for($i=array_key_first($tempDelivery); $i < $licznik ; $i++)
            {
                $zam_poz_dost_id = mysqli_real_escape_string($mysqli, $tempDelivery[$i]->zam_poz_dost_id) ?? NULL;
                $wytwor_id = mysqli_real_escape_string($mysqli, $tempDelivery[$i]->wytwor_id) ?? NULL;
                $ilosc_wydana = mysqli_real_escape_string($mysqli, $tempDelivery[$i]->ilosc_wydana) ?? NULL;
                $querypoz = "INSERT INTO t_wydanie_poz_dost_temp(wydanie_nag_dost_id,wytwor_id,ilosc,zam_poz_dost_id) VALUES ('$id','$wytwor_id','$ilosc_wydana','$zam_poz_dost_id')"; 
                $result_poz = mysqli_query($mysqli, $querypoz);
            }

            if(isset($result_poz)) {
                $output = array('error'  => false,'message' => 'Pozycje zostały dodane do wydania tymczasowego.');	
            }
            else {
                $output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
            }

    }

} else {
	$output = array('error'  => true,'message' => 'Brak danych.');
}


echo json_encode($output);
	







