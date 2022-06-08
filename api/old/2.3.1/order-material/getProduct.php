<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config.php';
$con = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($con, "utf8");

$products = array();
$sql = "SELECT * from k_produkty_szczegoly WHERE czy_aktywny=1";
$result = mysqli_query($con,$sql);

if(isset($result))
{
  $cr = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    $products[$cr]['produkt_id']= $row['produkt_id'];
    $products[$cr]['wytwor_id']= $row['wytwor_id'];
    $products[$cr]['nazwa']= $row['nazwa'];
    $products[$cr]['nazwajm']= $row['nazwa']." - ".$row['jm_idn'];
    $products[$cr]['wytwor_idm']= $row['wytwor_idm'];
    $products[$cr]['ilosc_magazyn']= $row['ilosc_magazyn'];
    $products[$cr]['jm_idn']= $row['jm_idn'];
    $products[$cr]['jm_id']= $row['jm_id'];
    $cr++;
  }
  $output = array('error'  => false,'message' => 'Prawidłowo przesłano dane.','data'=> $products); 
    
} else
{
	$output = array('error'  => true,'message' => 'Brak danych.');
}


echo json_encode($output);
?>