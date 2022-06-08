
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");


if(isset($_GET['nazwa_uzytkownika']) OR isset($_GET['email'])){

    if (isset($_GET['nazwa_uzytkownika'])){
        $nazwa_uzytkownika = $_GET['nazwa_uzytkownika'];
        $query = "SELECT nazwa_uzytkownika from t_uzytkownicy WHERE nazwa_uzytkownika='$nazwa_uzytkownika'";
        if(mysqli_num_rows(mysqli_query($mysqli,$query)) > 0) {
            $data=mysqli_fetch_array(mysqli_query($mysqli,$query),MYSQLI_ASSOC);
            $output = array('error'  => false,'message' => 'Użytkownik istnieje w bazie.','data' => $data);
        } else {$output = array('error'  => true,'message' => 'Brak rekordów.','data' => []);}

    }
    else if (isset($_GET['email'])){
        $email = $_GET['email'];
        $query = "SELECT email from t_uzytkownicy WHERE  email='$email'";
        if(mysqli_num_rows(mysqli_query($mysqli,$query)) > 0) {
            $data=mysqli_fetch_array(mysqli_query($mysqli,$query),MYSQLI_ASSOC);
            $output = array('error'  => false,'message' => 'Użytkownik istnieje w bazie.','data' => $data);
        } else {$output = array('error'  => true,'message' => 'Brak rekordów.','data' => []);}
    }

} else{
    $output = array('error'  => true,'message' => 'Brak danych.');
}
    

echo json_encode($output); 

