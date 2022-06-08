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
$deliverydata = $_POST['deliverydata'] ?? NULL;
$result_array_poz = array();

if (isset($uzytkownik_id)){


    switch ($action) {
        case 1:
            $query="DELETE FROM t_wydanie_poz_dost_temp WHERE zam_poz_dost_id='$deliverydata'";
            $result=mysqli_query($mysqli,$query);
        
            if (isset($result)){            
                $output = array('error'  => false,'message' => 'Pozycja została prawidłowo usunięta.');
            } else{
                $output = array('error'  => true,'message' => 'Błąd podczas usuwania.');
            }
            break;
        case 2:
            $query_insert_nag="INSERT INTO t_wydanie_nag_dost (uzytkownik_id_utworzenia, numer)
                    SELECT uzytkownik_id_utworzenia, numer
                    FROM t_wydanie_nag_dost_temp
                    WHERE uzytkownik_id_utworzenia='$uzytkownik_id' AND wydanie_nag_dost_id='$deliverydata'";
            $result_insert_nag=mysqli_query($mysqli,$query_insert_nag);


            $id=mysqli_insert_id($mysqli);
            $result_set=mysqli_query($mysqli,"set @lp=0;");
            $query_insert_poz="INSERT INTO t_wydanie_poz_dost (wydanie_nag_dost_id, nr_poz , wytwor_id,ilosc,zam_poz_dost_id)
                                SELECT $id, @lp:=@lp+1 as nr_poz , wyd.wytwor_id , wyd.ilosc, wyd.zam_poz_dost_id
                                FROM (
                                        SELECT wytwor_id, SUM(ilosc) AS ilosc,zam_poz_dost_id
                                        FROM t_wydanie_poz_dost_temp
                                        WHERE wydanie_nag_dost_id='$deliverydata'
                                        GROUP BY wytwor_id, zam_poz_dost_id
                                        ORDER BY zam_poz_dost_id asc
                                ) as wyd";
            $result_insert_poz=mysqli_query($mysqli,$query_insert_poz);

            $query_delete_nag="DELETE FROM t_wydanie_nag_dost_temp WHERE wydanie_nag_dost_id='$deliverydata'";
            $result_delete_nag=mysqli_query($mysqli,$query_delete_nag);

            $query_delete_poz="DELETE FROM t_wydanie_poz_dost_temp WHERE wydanie_nag_dost_id='$deliverydata'";
            $result_delete_poz=mysqli_query($mysqli,$query_delete_poz);

            
            if (isset($result_insert_nag) AND isset($result_insert_poz) AND isset($result_delete_nag) AND isset($result_delete_poz)){            
                $output = array('error'  => false,'message' => 'Wydanie zostało pomyślnie zatwierdzone.');
            } else{
                $output = array('error'  => true,'message' => 'Brak danych.');
            }
            break; 
        case 3:
            foreach ($deliverydata as $row) 
            { 
                $wydanie_poz_dost_id = $row['wydanie_poz_dost_id'] ?? NULL;
                $ilosc_potwierdzona = $row['ilosc_potwierdzona'] ?? 0;

                $query="UPDATE t_wydanie_poz_dost SET ilosc_potwierdzona='$ilosc_potwierdzona' WHERE wydanie_poz_dost_id='$wydanie_poz_dost_id'";
                $result=mysqli_query($mysqli,$query);
                array_push($result_array_poz, $result);              
            }

            if (array_search(false,$result_array_poz,true) == false){            
                $output = array('error'  => false,'message' => 'Wydanie zostało prawidłowo zaktualizowane.');
            } else{
                $output = array('error'  => true,'message' => 'Błąd podczas aktualizacji wydania.');
            }
            break;    
        case 4:
            $query="UPDATE t_wydanie_nag_dost SET status_id=2 , uzytkownik_id_przyjecia= '$uzytkownik_id' WHERE wydanie_nag_dost_id='$deliverydata'";
            $result=mysqli_query($mysqli,$query);
        
            if (isset($result)){            
                $output = array('error'  => false,'message' => 'Wydanie zostało poprawnie przyjęte.');
            } else{
                $output = array('error'  => true,'message' => 'Błąd podczas zatwierdzania.');
            }
            break;     
        }

} else {
    $output = array('error'  => true,'message' => 'Brak danych.');
}

echo json_encode($output);



