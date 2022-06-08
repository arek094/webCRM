<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$action = $_GET['action'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;

if (isset($uzytkownik_id)){


    switch ($action) {
        case 1:

            $query="UPDATE t_zgloszenia SET status_id=2 , uzytkownik_realizujacy=$uzytkownik_id WHERE  zgloszenie_id='$source_data' AND status_id=1 AND anulowany='N'";
            $result = mysqli_query($mysqli,$query);
            
        
            if (isset($result) AND (mysqli_affected_rows($mysqli) > 0)){            
                $output = array('error'  => false,'message' => 'Status został prawidłowo zmieniony.');
            } else{
                $output = array('error'  => true,'message' => 'Błąd podczas zmiany statusu.');
            }
            break; 
        case 2:
            $query="UPDATE t_zgloszenia SET status_id=3 WHERE zgloszenie_id='$source_data' AND status_id=2 AND anulowany='N'";
            $result=mysqli_query($mysqli,$query);
        
            if (isset($result) AND (mysqli_affected_rows($mysqli) > 0)){            
                $output = array('error'  => false,'message' => 'Status został prawidłowo zmieniony.');
            } else{
                $output = array('error'  => true,'message' => 'Błąd podczas zmiany statusu');
            }
            break;    
        case 3:
            $query="UPDATE t_zgloszenia SET anulowany='T' WHERE zgloszenie_id='$source_data' AND anulowany='N' AND status_id=1";
            $result=mysqli_query($mysqli,$query);
        
            if (isset($result) AND (mysqli_affected_rows($mysqli) > 0)){            
                $output = array('error'  => false,'message' => 'Zgłoszenie zostało anulowane.');
            } else{
                $output = array('error'  => true,'message' => 'Błąd podczas anulowania');
            }
            break; 

        default:
            $output = array('error'  => true,'message' => 'Brak danych.');
            break;
        }

} else {
    $output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);



