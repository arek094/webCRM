<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include("generateNumberOrder.php");


/*
Funkcja generowania zamówienia
$order - model Order
$types - typ zamowienia(1 - zamówienie surowców, 2 - zamówienie różnicowe surowców)
*/

function generateOrder($order,$types) {
    require_once '../config.php';
    $con = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($con, "utf8");
    switch ($types){
        case 1:
            $data_realizacji = date('Y-m-d H:i:s',strtotime(mysqli_real_escape_string($con, $order->data_realizacji)));
            $operacja_id = mysqli_real_escape_string($con, $order->operacja_id);
            $uwagi = mysqli_real_escape_string($con, $order->uwagi);
            $uzytkownik_id_utworzenia = mysqli_real_escape_string($con, $order->uzytkownik_id_utworzenia);
            $kontrahent_id = mysqli_real_escape_string($con, $order->kontrahent_id);
        
            $numer_zam=generateNumberOrder(false,0);
        
            $query_nag = "INSERT INTO t_zam_nag_dost(numer_zam,operacja_id,kontrahent_id,uzytkownik_id_utworzenia,data_realizacji,uwagi) 
                    VALUES ('$numer_zam','$operacja_id','$kontrahent_id','$uzytkownik_id_utworzenia','$data_realizacji','$uwagi')"; 
            
            mysqli_query($con, $query_nag);
                    
            $id=mysqli_insert_id($con);
            $licznik = count($order->order_item);
                for($i=0; $i < $licznik ; $i++)
                {
                    $nr_poz= $i + 1;
                    $wytwor_id = mysqli_real_escape_string($con, $order->order_item[$i]->wytwor_id);
                    $ilosc_oczekiwana = mysqli_real_escape_string($con, $order->order_item[$i]->ilosc_oczekiwana);
                    $jm_idn = mysqli_real_escape_string($con, $order->order_item[$i]->jm_idn);
                    $jm_id = mysqli_real_escape_string($con, $order->order_item[$i]->jm_id);
                    
                    if(mysqli_real_escape_string($con, isset($order->order_item[$i]->uwagi_poz))){
                        $uwagi_poz = mysqli_real_escape_string($con, $order->order_item[$i]->uwagi_poz);
                    }   else $uwagi_poz=NULL;

                    $querypoz = "INSERT INTO t_zam_poz_dost(zam_nag_dost_id,wytwor_id,ilosc_oczekiwana,nr_poz,jm_idn,jm_id,uwagi_poz) VALUES ('$id','$wytwor_id','$ilosc_oczekiwana','$nr_poz','$jm_idn','$jm_id','$uwagi_poz')"; 
                    mysqli_query($con, $querypoz);
                }
            break;
        case 2:
        default:
            echo "Błąd podczas generowania zamówienia.";
    }
    
}