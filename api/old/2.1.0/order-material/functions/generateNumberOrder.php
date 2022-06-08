<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

/*
Funkcja generowanie numery zamówienia
$czy_zam_roznicowe - (boolean)
$zam_nag_id - (tylko w przypadku generowania zamówienia różnicowego, jest to zamówienie z którego generowane jest zamówienie różnicowe)
*/

function generateNumberOrder($czy_zam_roznicowe,$zam_nag_dost_id) {

    require_once '../config.php';
    $con = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    $ostatni_numer = mysqli_query($con,"SELECT SUBSTRING(numer_zam, LOCATE('/',numer_zam,4) + 1, 5) as ostatni_numer FROM t_zam_nag_dost WHERE operacja_id=1 AND right(numer_zam,1)=0 AND SUBSTRING(numer_zam, LOCATE('/',numer_zam,2) + 1, 4) = YEAR(NOW()) order by numer_zam DESC LIMIT 1");
    $ostatni_numer_wiersz = mysqli_fetch_array($ostatni_numer,MYSQLI_ASSOC);
	
	$numer = str_pad($ostatni_numer_wiersz["ostatni_numer"] + 1, 5, "0", STR_PAD_LEFT);
    $rok = date("Y");
    $zam_bazowe = mysqli_query($con,"SELECT numer_zam FROM t_zam_nag_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'");
    $zam_bazowe_wiersz = mysqli_fetch_array($zam_bazowe,MYSQLI_ASSOC);

    if(empty(substr($zam_bazowe_wiersz["numer_zam"] ?? NULL, -1))){
        $numer_zam_ostatni_znak = 0;
    }   else $numer_zam_ostatni_znak = substr($zam_bazowe_wiersz["numer_zam"], -1);

    switch ($czy_zam_roznicowe){
        case false:
            $numer_zam = 'P1'.'/'.$rok.'/'.$numer.'#'.$numer_zam_ostatni_znak;
            return $numer_zam;
            break;
        case true:
            $numer_zam_ostatni_znak = $numer_zam_ostatni_znak + 1;
            $zam_bazowe_wiersz = substr($zam_bazowe_wiersz["numer_zam"],8,5);
            $numer_zam = 'P1'.'/'.$rok.'/'.$zam_bazowe_wiersz.'#'.$numer_zam_ostatni_znak;
            return $numer_zam;
            break;
        default:
            echo "Błędny typ zamówienia, numer zamówienia nie został wygenerowany.";
    }
    
}