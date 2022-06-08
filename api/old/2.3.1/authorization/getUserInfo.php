<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include('../functions/f_insert_log_user.php');
require_once '../config.php';

require "../vendor/autoload.php";
use \Firebase\JWT\JWT;

$_POST = json_decode(file_get_contents('php://input'), true);

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

$uzytkownik_id = $_POST['uzytkownik_id'] ?? NULL;
$usersList_array =array();

if (isset($uzytkownik_id)){
    $query = "SELECT * from k_uzytkownicy_szczegoly WHERE (uzytkownik_id='$uzytkownik_id')";
    $result = mysqli_query($mysqli,$query);

    if(isset($result)){
        while($row = mysqli_fetch_array($result)) {
            $data['uzytkownik_id'] = $row['uzytkownik_id'];
            $data['kontrahent_id'] = $row['kontrahent_id'];
            $data['nazwa_uzytkownika'] = $row['nazwa_uzytkownika'];
            $data['imie'] = $row['imie'];
            $data['nazwisko'] = $row['nazwisko'];
            $data['email'] = $row['email'];
            $data['grupa_id'] = $row['grupa_id'];
            $data['url_po_zalogowaniu'] = $row['url_po_zalogowaniu'];
            $data['kontrahent_nazwa'] = $row['kontrahent_nazwa'];
            $data['jezyk'] = $row['jezyk'];
            $data['dane_osobowe_panel_uzytk'] = $row['dane_osobowe_panel_uzytk'];
            $data['regulamin_panel_uzytk'] = $row['regulamin_panel_uzytk'];
            $data['permission'] = array();

            $query_permission = "SELECT uprawnienia_id,obiekt_id,grupa_id from t_uprawnienia_users WHERE grupa_id = ".$row['grupa_id']."";
            $result_permission = mysqli_query($mysqli,$query_permission);

            while($row_permission = mysqli_fetch_assoc($result_permission)){
                $data_permission['uprawnienia_id'] = $row_permission['uprawnienia_id'];
                $data_permission['obiekt_id'] = $row_permission['obiekt_id'];
                $data_permission['grupa_id'] = $row_permission['grupa_id'];

                array_push($data['permission'],$data_permission);
            }
        array_push($usersList_array,$data);   
        }
        $output = array('error'  => false,'message' => 'Prawidłowo przesłano dane.','data'=> $usersList_array[0]);
    }
    else {
        $output = array('error'  => true,'message' => 'Brak użytkownika o podanym ID.');
    }
}
else{
    $output = array('error'  => true,'message' => 'Brak danych.');
}
    

echo json_encode($output);