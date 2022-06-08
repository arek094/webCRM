<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");

$usersList_array =array();
$user_array = array();
$note_array = array();
$zam_nag_dost_id = $_GET['zam_nag_dost_id'];
$fetch_users = mysqli_query($mysqli, "SELECT * from k_zam_nag_raport where zam_nag_dost_id = '$zam_nag_dost_id'") or die(mysqli_error($mysqli));
while ($row_users = mysqli_fetch_assoc($fetch_users)) {
    $user_array['zam_nag_dost_id'] = $row_users['zam_nag_dost_id'];
    $user_array['data_realizacji'] = $row_users['data_realizacji'];
    $user_array['data_realizacji_magazyn'] = $row_users['data_realizacji_magazyn'];
    $user_array['anulowany'] = $row_users['anulowany'];
    $user_array['status_id'] = $row_users['status_id'];
    $user_array['eksport'] = $row_users['eksport'];
    $user_array['uwagi'] = $row_users['uwagi'];
    $user_array['status_nazwa'] = $row_users['status_nazwa'];
    $user_array['uzytkownik_id_utworzenia'] = $row_users['uzytkownik_id_utworzenia'];
    $user_array['numer_zam'] = $row_users['numer_zam'];
    $user_array['kontrahent_nazwa'] = $row_users['kontrahent_nazwa'];
    $user_array['order_item'] = array();

    $fetch_order_item = mysqli_query($mysqli, "SELECT * FROM k_zam_poz_raport WHERE zam_nag_dost_id = ".$row_users['zam_nag_dost_id']."") or die(mysqli_error($mysqli));
    while ($row_order_item = mysqli_fetch_assoc($fetch_order_item)) {
        $note_array['zam_poz_dost_id']=$row_order_item['zam_poz_dost_id'];
        $note_array['zam_nag_dost_id']=$row_order_item['zam_nag_dost_id'];
        $note_array['wytwor_id']=$row_order_item['wytwor_id'];
        $note_array['wytwor_nazwa']=$row_order_item['wytwor_nazwa'];
        $note_array['nr_poz']=$row_order_item['nr_poz'];
        $note_array['ilosc_oczekiwana']=$row_order_item['ilosc_oczekiwana'];
        $note_array['ilosc_wydana']=$row_order_item['ilosc_wydana'];
        $note_array['anulowany_poz']=$row_order_item['anulowany_poz'];
        array_push($user_array['order_item'],$note_array);
    }

    array_push($usersList_array,$user_array);
    
    
}

$jsonData = json_encode($usersList_array);

echo json_encode(['data'=>$usersList_array]);