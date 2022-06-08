<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include('../functions/f_insert_log.php');
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$data = json_decode(file_get_contents("php://input"));
$zam_nag_dost_id = $_GET['zam_nag_dost_id'] ?? NULL;
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;

$array_poz_mail_cancel = array();


if(isset($data)){

	if(mysqli_real_escape_string($mysqli, isset($data->order->data_realizacji_magazyn))){
		$data_realizacji_magazyn = trim(date('Y-m-d H:i:s',strtotime(mysqli_real_escape_string($mysqli, $data->order->data_realizacji_magazyn))));
		$u_data_realizacji_magazyn = "data_realizacji_magazyn='$data_realizacji_magazyn'";
	}	else $u_data_realizacji_magazyn="";


	if(mysqli_real_escape_string($mysqli, isset($data->order->typ_dok_erp_id))){
		$typ_dok_erp_id = trim(mysqli_real_escape_string($mysqli, $data->order->typ_dok_erp_id));
		$u_typ_dok_erp_id = "typ_dok_erp_id=$typ_dok_erp_id";
	}	else $u_typ_dok_erp_id = "";

	if(mysqli_real_escape_string($mysqli, isset($data->order->data_realizacji))){
		$data_realizacji = trim(date('Y-m-d H:i:s',strtotime(mysqli_real_escape_string($mysqli, $data->order->data_realizacji))));
		$u_data_realizacji = "data_realizacji='$data_realizacji'";
	}	else $u_data_realizacji = "";

	if(mysqli_real_escape_string($mysqli, isset($data->order->uwagi))){
		$uwagi = trim(mysqli_real_escape_string($mysqli, $data->order->uwagi));
		$u_uwagi = "uwagi='$uwagi'";
	}	else $u_uwagi = "";

	//Update nagłówka zamówienia
	$update_field_tmp = trim("$u_data_realizacji $u_data_realizacji_magazyn $u_uwagi $u_typ_dok_erp_id");
	if($update_field_tmp <> "  "){
		$update_field = str_replace("  ", ",", $update_field_tmp);
		$query = "UPDATE t_zam_nag_dost SET $update_field WHERE zam_nag_dost_id='$zam_nag_dost_id'";
		$result1= mysqli_query($mysqli, $query);
		if (isset($result1)){
			$output = array('error'  => false,'message' => 'Zamówienie zostało pomyślnie edytowane.');
		} else { $output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.'); }
	}

	$licznik = count($data->order->order_item);
		for($i=0; $i < $licznik ; $i++)
		{
			$query_value = array();

			if(mysqli_real_escape_string($mysqli, isset($data->order->order_item[$i]->zam_poz_dost_id))){
				$zam_poz_dost_id = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->zam_poz_dost_id));
				$u_zam_poz_dost_id = "zam_poz_dost_id='$zam_poz_dost_id'";
				array_push($query_value,$u_zam_poz_dost_id);
			}	else {$u_zam_poz_dost_id = null;$zam_poz_dost_id=null;}

			if(mysqli_real_escape_string($mysqli, isset($data->order->order_item[$i]->wytwor_id))){
				$wytwor_id = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->wytwor_id));
				$u_wytwor_id = "wytwor_id='$wytwor_id'";
				array_push($query_value,$u_wytwor_id);
			}	else { $u_wytwor_id = null ; $wytwor_id = null;}

			if(mysqli_real_escape_string($mysqli, isset($data->order->order_item[$i]->ilosc_oczekiwana))){
				$ilosc_oczekiwana = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->ilosc_oczekiwana));
				$u_ilosc_oczekiwana= "ilosc_oczekiwana='$ilosc_oczekiwana'";
				array_push($query_value,$u_ilosc_oczekiwana);
			}	else {$u_ilosc_oczekiwana = null;$ilosc_oczekiwana = null;}

			if(mysqli_real_escape_string($mysqli, isset($data->order->order_item[$i]->ilosc_wydana))){
				$ilosc_wydana = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->ilosc_wydana));
				$u_ilosc_wydana = "ilosc_wydana='$ilosc_wydana'";
				array_push($query_value,$u_ilosc_wydana);
			}	else {$u_ilosc_wydana = null;$ilosc_wydana = null;}

			if(mysqli_real_escape_string($mysqli, isset($data->order->order_item[$i]->uwagi_poz))){
				$uwagi_poz = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->uwagi_poz));
				$u_uwagi_poz = "uwagi_poz='$uwagi_poz'";
				array_push($query_value,$u_uwagi_poz);
			}	else {$u_uwagi_poz = null ; $uwagi_poz=null;}

			if(mysqli_real_escape_string($mysqli,isset($data->order->order_item[$i]->czy_zamowienie_roznicowe))){
				$czy_zamowienie_roznicowe = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->czy_zamowienie_roznicowe));
				$u_czy_zamowienie_roznicowe = "czy_zamowienie_roznicowe='$czy_zamowienie_roznicowe'";
				array_push($query_value,$u_czy_zamowienie_roznicowe);
			}	else {$u_czy_zamowienie_roznicowe = null; $czy_zamowienie_roznicowe = null;}

			if(mysqli_real_escape_string($mysqli, isset($data->order->order_item[$i]->jm_idn))){
				$jm_idn = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->jm_idn));
				$u_jm_idn = "jm_idn='$jm_idn'";
				array_push($query_value,$u_jm_idn);
			}	else {$u_jm_idn = null;$jm_idn = null;}

			if(mysqli_real_escape_string($mysqli, isset($data->order->order_item[$i]->jm_id))){
				$jm_id = trim(mysqli_real_escape_string($mysqli, $data->order->order_item[$i]->jm_id));
				$u_jm_id = "jm_id='$jm_id'";
				array_push($query_value,$u_jm_id);
			}	else {$u_jm_id = null;$jm_id = null;}

			
			

			//Dodawanie nowych produktów
			if($zam_poz_dost_id == null){
				$nr_poz= $i + 1;
				$query2 = "INSERT INTO t_zam_poz_dost(zam_nag_dost_id,wytwor_id,ilosc_oczekiwana,nr_poz,jm_idn,jm_id,uwagi_poz) VALUES ('$zam_nag_dost_id','$wytwor_id','$ilosc_oczekiwana','$nr_poz','$jm_idn','$jm_id','$uwagi_poz')"; 
				$result2= mysqli_query($mysqli, $query2);
				if (isset($result2)){
					$output = array('error'  => false,'message' => 'Zamówienie zostało pomyślnie edytowane.');
				} else {$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');}

			//Aktualizacja pozycji zamówienia	
			} else if ($zam_poz_dost_id<>"")  {
			//Aktualizacja numerow pozycji
				$nr_poz= $i + 1;
				$u_nr_poz = "nr_poz='$nr_poz'";
				array_push($query_value,$u_nr_poz);	

				$update_field = implode(',',$query_value);
				$query1 = "UPDATE t_zam_poz_dost SET $update_field WHERE zam_nag_dost_id='$zam_nag_dost_id' AND zam_poz_dost_id='$zam_poz_dost_id'"; 
				$result3= mysqli_query($mysqli, $query1);
				if (isset($result3)){
					$output = array('error'  => false,'message' => 'Zamówienie zostało pomyślnie edytowane.');
					} else {$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');}
				}
		}
			//Usuwanie pozycji
		$deletes_poz_count = count($data->deletes_poz);
		if ($deletes_poz_count <> 0){
			for($i=0; $i < $deletes_poz_count ; $i++){
				$deletes_poz = mysqli_real_escape_string($mysqli, $data->deletes_poz[$i]);
				$query1 = "DELETE FROM t_zam_poz_dost WHERE zam_nag_dost_id='$zam_nag_dost_id' AND zam_poz_dost_id='$deletes_poz'"; 
				$result4= mysqli_query($mysqli, $query1);
				if (isset($result4)){
					$output = array('error'  => false,'message' => 'Zamówienie zostało pomyślnie edytowane.');
				} else {$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');}
			}
		}
			//Anulowanie pozycji
		$cancel_poz_count = count($data->cancel_poz);
		if ($cancel_poz_count <> 0){
			for($i=0; $i < $cancel_poz_count ; $i++){
				$cancel_poz = mysqli_real_escape_string($mysqli, $data->cancel_poz[$i]);
				$query1 = "UPDATE t_zam_poz_dost SET anulowany='T' WHERE zam_nag_dost_id='$zam_nag_dost_id' AND zam_poz_dost_id='$cancel_poz'"; 
				$result5= mysqli_query($mysqli, $query1);
				if (isset($result5)){
					$output = array('error'  => false,'message' => 'Zamówienie zostało pomyślnie edytowane.');
				} else {$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');}

				insertLog('zam_nag_dost_id: '.$zam_nag_dost_id,'Uzytkownik',$uzytkownik_id,'Anulowanie pozycji','Anulowana pozycja: '.$cancel_poz);

				$row_zam_poz = mysqli_fetch_array(mysqli_query($mysqli,"SELECT CONCAT('Pozycja: ',nr_poz,' | ','Indeks: ',wytwor_idm,' | ','Ilość oczekiwana: ',ilosc_oczekiwana) as position_cancel FROM k_zam_poz_dost_szczegoly WHERE zam_nag_dost_id='$zam_nag_dost_id' AND zam_poz_dost_id='$cancel_poz' "),MYSQLI_ASSOC);
				$position_cancel = $row_zam_poz["position_cancel"];
				array_push($array_poz_mail_cancel,$position_cancel);

			}
		
		$row_zam = mysqli_fetch_array(mysqli_query($mysqli,"SELECT uzytkownik_id_utworzenia,numer_zam FROM t_zam_nag_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'"),MYSQLI_ASSOC);
		$uzytkownik_id_utworzenia = $row_zam["uzytkownik_id_utworzenia"];
		$numer_zam = $row_zam["numer_zam"];
		
		$row_uzytk = mysqli_fetch_array(mysqli_query($mysqli,"SELECT email,imie,nazwisko FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id_utworzenia'"),MYSQLI_ASSOC);
		$email = $row_uzytk["email"];	
		$nazwisko_imie = $row_uzytk['nazwisko'].' '.$row_uzytk['imie'];
		$tytul = $numer_zam;
		$tresc = 'Następujące pozycje z zamówienia'.' '.$numer_zam.' '.'zostaly anulowane:'.implode($array_poz_mail_cancel);

		$query1 = "INSERT INTO t_wysylka_mail (tytul,tresc,email,nazwisko_imie) VALUES ('$tytul','$tresc','$email','$nazwisko_imie')"; 
		$result6= mysqli_query($mysqli, $query1);
		if (isset($result6)){
			$output = array('error'  => false,'message' => 'Zamówienie zostało pomyślnie edytowane.');
		} else {$output = array('error'  => true,'message' => 'Wystąpił błąd podczas operacji, prosimy spróbować później.');}
				
		}
		
} else
{
	$output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);









