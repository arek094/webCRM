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

$login = $_POST['login'] ?? NULL;
$haslo = $_POST['haslo'] ?? NULL;
$usersList_array =array();

$query_haslo = "SELECT * from k_uzytkownicy_szczegoly WHERE (nazwa_uzytkownika='$login' OR email='$login') 
                AND czy_aktywny=1 AND czy_email_zweryfikowany=1 AND polityka_cookie=1 AND polityka_prywatnosci=1 AND polityka_przerw_dostepnosci=1 AND info_administratora=1 AND info_przetwarzania_danych=1";
$result_haslo = mysqli_query($mysqli,$query_haslo);
$row_haslo = mysqli_fetch_array($result_haslo);
$haslo_db = $row_haslo['haslo'] ?? NULL;

if (isset($login,$haslo)){

    if (password_verify($haslo, $haslo_db)) {

        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT * from k_uzytkownicy_szczegoly WHERE (nazwa_uzytkownika='$login' OR email='$login') AND czy_aktywny=1 AND czy_email_zweryfikowany=1 AND polityka_cookie=1 AND polityka_prywatnosci=1 AND polityka_przerw_dostepnosci=1 AND info_administratora=1 AND info_przetwarzania_danych=1"),MYSQLI_ASSOC);
        $email = $row["email"];
        $uzytkownik_id = $row["uzytkownik_id"];
        $nazwa_uzytkownika = $row["nazwa_uzytkownika"];

        $key = "key_super_secure";
        $payload = [
            'uzytkownik_id' => $uzytkownik_id,
            'nazwa_uzytkownika' => $nazwa_uzytkownika,
            'email' => $email,
            'exp' => time() + 9000
        ];

        $token = JWT::encode($payload, $key);

        if (isset($uzytkownik_id)){
            $query = "SELECT * from k_uzytkownicy_szczegoly WHERE (uzytkownik_id='$uzytkownik_id')";
            $result = mysqli_query($mysqli,$query);
        
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
            }
        }
            else {
                $output = array('error'  => true,'message' => 'Brak użytkownika o podanym ID.');
            }
        }

        $output = array('error'  => false,'message' => 'Operacja logowania przebiegła pomyślnie.','token' => $token,'data' => $usersList_array);
        insertLogUser($uzytkownik_id,3,'Logowanie',$output['message'],null,null);
    }

        else {
            $output = array('error'  => true,'message' => 'Nieprawidłowa nazwa użytkownika lub hasło. Spróbuj ponownie lub skorzystaj z opcji odzyskiwania hasła.');
    }

}  else {
        $output = array('error'  => true,'message' => 'Brak danych.');
}
echo json_encode($output);