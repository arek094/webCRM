<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../functions/f_insert_email.php');
include('../functions/f_insert_log_user.php');
include('../sendMail.php');
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

$_POST = json_decode(file_get_contents('php://input'),true);
$email = $_POST['email'] ?? NULL;
$token = bin2hex(random_bytes(16));

if(isset($email)){
    $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT uzytkownik_id,imie,nazwisko FROM t_uzytkownicy WHERE email='$email'"),MYSQLI_ASSOC);
    $uzytkownik_id = $row["uzytkownik_id"];
    $imie = $row["imie"];
    $nazwisko = $row["nazwisko"];

    if(isset($uzytkownik_id)){

        $name_email_adress = $nazwisko." ".$imie;
        $subject = 'Przypomnienie hasla';
        $message = link_page.'reset-password/'.$uzytkownik_id.'/'.$token;

        $query = "SELECT uzytkownik_id FROM t_uzytkownicy WHERE email='$email' AND czy_aktywny=1 AND czy_email_zweryfikowany=1";

        if(mysqli_num_rows(mysqli_query($mysqli,$query)) > 0) {
            mysqli_query($mysqli,"UPDATE t_uzytkownicy SET token='$token' WHERE email='$email'");

            $query_log = preg_replace("/[\n\r\t']/","",$query); 
            insertEmail($subject,$message,$email,$name_email_adress,null);
            insertLogUser($uzytkownik_id,5,'Przypomnienie hasła','Przypomnienie hasła',$query_log);
            $output = array('error'  => false,'message' => 'E-mail z łączem do zmiany hasła został pomyślnie wysłany na Twoją skrzynkę pocztową o adresie '.$email.'.');
        }
        else{
            $output = array('error'  => true,'message' => 'Wystąpił błąd podczas próby zmiany hasła, prosimy spróbować później.');
        }
    } else {
        $output = array('error'  => true,'message' => 'Brak użytkownika o podanym adresie email.');
    }
        
} else {
    $output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);


