<?php
header("Access-Control-Allow-Origin: https://localhost:4200");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Credentials: true");
include('../functions/f_insert_log_user.php');
require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$_POST = json_decode(file_get_contents('php://input'),true);
$token = $_POST['token'] ?? NULL;
$uzytkownik_id = $_POST['uzytkownik_id'] ?? NULL;

$query1 = "SELECT uzytkownik_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id' AND token='$token'";
$query2 = "UPDATE t_uzytkownicy SET czy_email_zweryfikowany=1 WHERE uzytkownik_id='$uzytkownik_id' AND token='$token'";
$query3 = "UPDATE t_uzytkownicy SET token = NULL WHERE uzytkownik_id='$uzytkownik_id'";

if(mysqli_num_rows(mysqli_query($mysqli,$query1)) > 0) {
    mysqli_query($mysqli,$query2);
    $output = array('error'  => false,'message' => 'Adres e-mail został prawidłowo zweryfikowany. Poczekaj na aktywacje konta przez naszych pracowników.');
    mysqli_query($mysqli,$query3);

    $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT email FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
    $email = $row["email"];
    $akcja_opis = 'Weryfikacja adresu e-mail: '.$email;

    $query_log = preg_replace("/[\n\r\t']/","",$query2); 
    insertLogUser($uzytkownik_id,2,'Weryfikacja adresu e-mail',$akcja_opis,$query_log,null);
}
else
{
    $output = array('error'  => true,'message' => 'Błąd podczas weryfikacji adresu e-mail.');
}
 

echo json_encode($output);