<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");
include('../functions/f_insert_log.php');

require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

include("functions/generateOrder.php");

$zam_nag_dost_id = $_GET['zam_nag_dost_id'] ?? NULL;
$action = $_GET['action'] ?? NULL;
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;

$order = $mysqli->query("SELECT * FROM t_zam_nag_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'") or die(mysql_error());  
$row_order = mysqli_fetch_array($order);
$status_id = $row_order['status_id'] ?? NULL;
$anulowany = $row_order['anulowany'] ?? NULL;
$data_realizacji = $row_order['data_realizacji'] ?? NULL;
$data_realizacji_magazyn = $row_order['data_realizacji_magazyn'] ?? NULL;
$operacja_id = $row_order['operacja_id'] ?? NULL;


$user = $mysqli->query("SELECT * FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'") or die(mysql_error()); 
$row_user = mysqli_fetch_array($user);
$kontrahent_id= $row_user['kontrahent_id'];

$zam_poz = $mysqli->query("SELECT * FROM t_zam_poz_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'") or die(mysql_error()); 
$row_zam_poz = mysqli_fetch_array($zam_poz);
$wytwor_id = $row_zam_poz['wytwor_id'];
$ilosc_oczekiwana = $row_zam_poz['ilosc_oczekiwana'];


switch ($action) {
    case 1:
        if ($status_id == 1){
            $query = "UPDATE t_zam_nag_dost SET status_id=2,data_zapisania=NOW() WHERE zam_nag_dost_id='$zam_nag_dost_id'";
            mysqli_query($mysqli, $query);
            http_response_code(201);
            echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
        }
        else{
            http_response_code(503);
            echo json_encode(array("message" => "Błąd podczas wykonywania operacji."));
        }
        break;
    case 2:
        if (($status_id == 2) && ($data_realizacji_magazyn == NULL) && ($anulowany == 'N'))
        $query = "UPDATE t_zam_nag_dost SET status_id=3, data_realizacji_magazyn=data_realizacji,uzytkownik_id_zatw_mag='$uzytkownik_id',data_potwierdzenia=NOW() WHERE zam_nag_dost_id='$zam_nag_dost_id'";
        else if (($status_id == 2) && ($data_realizacji_magazyn <> '0000-00-00') && ($anulowany == 'N')) 
        $query = "UPDATE t_zam_nag_dost SET status_id=3, data_realizacji_magazyn='$data_realizacji_magazyn', uzytkownik_id_zatw_mag='$uzytkownik_id',data_potwierdzenia=NOW() WHERE zam_nag_dost_id='$zam_nag_dost_id'";
        mysqli_query($mysqli, $query);
        http_response_code(201);
        echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
        break;
    case 4:
        if (($anulowany == 'N') && ($status_id == 2) || ($status_id == 3) )
        $query = "UPDATE t_zam_nag_dost SET anulowany='T',data_anulowania=NOW() WHERE zam_nag_dost_id='$zam_nag_dost_id'"; 
        mysqli_query($mysqli, $query);
        insertLog('zam_nag_dost_id: '.$zam_nag_dost_id, 'Uzytkownik',$uzytkownik_id,'Anulowanie nagłówka',null);
        http_response_code(201);
        echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
        break;
    case 5:

        $numer_zam = generateNumberOrder(false,0);
        
        $query = "INSERT INTO t_zam_nag_dost(numer_zam,operacja_id,kontrahent_id,uzytkownik_id_utworzenia,data_realizacji) 
        SELECT '$numer_zam',operacja_id,kontrahent_id,'$uzytkownik_id',data_realizacji FROM t_zam_nag_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'";
        mysqli_query($mysqli, $query);
        $id=mysqli_insert_id($mysqli);

        $query1 = "INSERT INTO t_zam_poz_dost(zam_nag_dost_id,wytwor_id,ilosc_oczekiwana,nr_poz,jm_idn,jm_id) 
        SELECT '$id',wytwor_id,ilosc_oczekiwana,nr_poz,jm_idn,jm_id FROM t_zam_poz_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'";
        mysqli_query($mysqli, $query1);

        http_response_code(201);
        echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
        break;
    case 6:
        if ($status_id == 1 ){
            $query = "DELETE FROM t_zam_nag_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'"; 
            mysqli_query($mysqli, $query);
            $query1 = "DELETE FROM t_zam_poz_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'"; 
            mysqli_query($mysqli, $query1);
            http_response_code(201);
            echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
        }
        else
        {
            http_response_code(503);
            echo json_encode(array("message" => "Błąd podczas wykonywania operacji."));
        }
        break;
    case 7:
        $query_check_quantity = "SELECT zam_nag_dost_id,czy_zamowienie_roznicowe,anulowany FROM t_zam_poz_dost WHERE anulowany='N' AND zam_nag_dost_id='$zam_nag_dost_id' AND ((ilosc_oczekiwana - ilosc_wydana)>0 OR ilosc_wydana IS NULL)";
        $result_quantity = mysqli_query($mysqli, $query_check_quantity);
        $num_row = mysqli_num_rows($result_quantity);

        $row_czy_roznicowe = mysqli_fetch_array($result_quantity);
        $czy_roznicowe= $row_czy_roznicowe['czy_zamowienie_roznicowe'] ?? NULL;


        $query_numer_zam = "SELECT numer_zam FROM t_zam_nag_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'";
        $result_numer_zam = mysqli_query($mysqli, $query_numer_zam);
        $row_numer_zam = mysqli_fetch_array($result_numer_zam);
        $numer_zam_baz= $row_numer_zam['numer_zam'] ?? NULL;

        if ($czy_roznicowe == true){ 

            $query = "UPDATE t_zam_nag_dost SET status_id=4,data_zrealizowania=NOW() WHERE zam_nag_dost_id='$zam_nag_dost_id'";
            mysqli_query($mysqli, $query);

            $numer_zam = generateNumberOrder(true,$zam_nag_dost_id);

            $query1 = "INSERT INTO t_zam_nag_dost(numer_zam,operacja_id,kontrahent_id,uzytkownik_id_utworzenia,data_realizacji,status_id) 
            SELECT '$numer_zam',operacja_id,kontrahent_id,162,data_realizacji,'2' FROM t_zam_nag_dost WHERE zam_nag_dost_id='$zam_nag_dost_id'";
            mysqli_query($mysqli, $query1);
            $id=mysqli_insert_id($mysqli);
    
            $query2 = "INSERT INTO t_zam_poz_dost(zam_nag_dost_id,wytwor_id,ilosc_oczekiwana,nr_poz,uwagi_poz,jm_idn,jm_id)
            SELECT '$id',wytwor_id,ilosc_oczekiwana-ilosc_wydana,(@nr_poz_tmp:=@nr_poz_tmp + 1) AS nr_poz_tmp, CONCAT('$numer_zam_baz', ': ', nr_poz)AS nr_poz,jm_idn,jm_id  FROM t_zam_poz_dost,(SELECT @nr_poz_tmp:=0) AS t WHERE zam_nag_dost_id='$zam_nag_dost_id' AND czy_zamowienie_roznicowe=true AND ilosc_oczekiwana<>ilosc_wydana";
            mysqli_query($mysqli, $query2);
            http_response_code(201);
            echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
            

        } else if(($anulowany == 'N') && ($status_id == 3) && ($num_row == 0)){
            $query = "UPDATE t_zam_nag_dost SET status_id=5,data_zrealizowania=NOW() WHERE zam_nag_dost_id='$zam_nag_dost_id'";
            mysqli_query($mysqli, $query);
            http_response_code(201);
            echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
         } else if(($anulowany == 'N') && ($status_id == 3) && ($num_row > 0)) {
            $query = "UPDATE t_zam_nag_dost SET status_id=4,data_zrealizowania=NOW() WHERE zam_nag_dost_id='$zam_nag_dost_id'";
            mysqli_query($mysqli, $query); 
            http_response_code(201);
            echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Błąd podczas wykonywania operacji."));
        }
        break;
    case 8:
        if (($anulowany == 'N') && ($status_id == 4)){
            $query = "UPDATE t_zam_nag_dost SET status_id=5 WHERE zam_nag_dost_id='$zam_nag_dost_id'";
            mysqli_query($mysqli, $query);
            http_response_code(201);
            echo json_encode(array("message" => "Operacja wykonana pomyślnie."));
        }
        else
        {
            http_response_code(503);
            echo json_encode(array("message" => "Błąd podczas wykonywania operacji."));
        }
        break;
}






	
	

