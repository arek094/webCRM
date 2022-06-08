<?php
include('../functions/f_insert_email_group.php');
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

$notification = json_decode(file_get_contents("php://input"));
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;


if(isset($notification)){
    $temat_zgloszenia = mysqli_real_escape_string($mysqli, $notification->temat_zgloszenia) ?? NULL ;
    $opis_zgloszenia = mysqli_real_escape_string($mysqli, $notification->opis_zgloszenia) ?? NULL ;
    $telefon_kontaktowy = mysqli_real_escape_string($mysqli, $notification->telefon_kontaktowy) ?? NULL ;

    $ostatni_numer = mysqli_query($mysqli,"SELECT SUBSTRING(numer, LOCATE('/',numer,4) + 1, 4) as ostatni_numer FROM t_zgloszenia WHERE SUBSTRING(numer, LOCATE('/',numer,2) + 3, 4) = YEAR(NOW()) order by numer DESC LIMIT 1");
    $ostatni_numer_wiersz = mysqli_fetch_array($ostatni_numer,MYSQLI_ASSOC);
    $ostatni_numer_wiersz_check = isset($ostatni_numer_wiersz["ostatni_numer"]) ? $ostatni_numer_wiersz["ostatni_numer"] : 0;
    
    $numer = str_pad($ostatni_numer_wiersz_check + 1, 4, "0", STR_PAD_LEFT);
    
    $dzien = date("d");
    $miesiac = date("m");
    $rok = date("Y");
    $numer = 'IP'.'/'.$miesiac.$rok.'/'.$numer;

	$query = "INSERT INTO t_zgloszenia(temat_zgloszenia,opis_zgloszenia,telefon_kontaktowy,uzytkownik_id_utworzenia,numer) 
            VALUES ('$temat_zgloszenia','$opis_zgloszenia','$telefon_kontaktowy','$uzytkownik_id','$numer')"; 
    $result = mysqli_query($mysqli, $query);

    insertEmailGroup('Zgłoszenie','Pojawiło się nowe zgłoszenie o numerze '.$numer,1,$uzytkownik_id);

	if (isset($result)){
		$output = array('error'  => false,'message' => 'Pomyślnie dodano zgłoszenie.');
	} else {
		$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');
	}	
	
} else
{
		$output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);