<?php
require_once '../function.php';
require_once '../config.php';
$_POST = json_decode(file_get_contents('php://input'),true);
$uzytkownik_id = $_GET['uzytkownik_id'] ?? NULL;
$source_data = $_POST['source_data'] ?? NULL;
$id = $_POST['id'] ?? NULL;
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


switch ($source_data) {
    case 'k_zam_nag_dost_lista':
        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT kontrahent_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
        $kontrahent_id = $row["kontrahent_id"] ?? NULL;

        if($kontrahent_id == 0){
            $output = GetDataQuery('SELECT * from k_zam_nag_dost_lista WHERE status_id<>1 AND operacja_id='.$id.'',$uzytkownik_id);   
        }
        else {
            $output = GetDataQuery('SELECT * from k_zam_nag_dost_lista WHERE operacja_id='.$id.' AND kontrahent_id='.$kontrahent_id.'',$uzytkownik_id);  
        }

        break; 
    case 'k_zam_poz_dost_szczegoly':
        $output = GetDataQuery('SELECT * FROM k_zam_poz_dost_szczegoly WHERE zam_nag_dost_id='.$id.'',$uzytkownik_id);
        break;  
    case 'k_zam_poz_dost_szczegoly_IN':
        $id = implode(",", $id);
        $output = GetDataQuery('SELECT * FROM k_zam_poz_dost_szczegoly WHERE zam_nag_dost_id in('.$id.')',$uzytkownik_id);
        break; 
    case 'wydanie_poz_dost_zam_poz':
        $row = mysqli_fetch_array(mysqli_query($mysqli,"SELECT kontrahent_id FROM t_uzytkownicy WHERE uzytkownik_id='$uzytkownik_id'"),MYSQLI_ASSOC);
        $kontrahent_id = $row["kontrahent_id"] ?? NULL;

        $id = implode(",", $id);
        $output = GetDataQuery('SELECT 
                                k_zam_poz_raport.numer_zam,
                                k_zam_poz_raport.kontrahent_nazwa,
                                k_zam_poz_raport.kontrahent_id,
                                k_zam_poz_raport.status_nazwa,
                                k_zam_poz_raport.data_realizacji,
                                k_zam_poz_raport.zam_poz_dost_id,
                                k_zam_poz_raport.nr_poz,
                                k_zam_poz_raport.zam_nag_dost_id,
                                k_zam_poz_raport.wytwor_id,
                                k_zam_poz_raport.wytwor_idm,
                                k_zam_poz_raport.wytwor_nazwa,
                                k_zam_poz_raport.anulowany_poz,
                                k_zam_poz_raport.ilosc_oczekiwana - IFNULL(k_wydanie_poz_dost_temp_szczegoly.ilosc,0) - CASE WHEN t_wydanie_nag_dost.status_id=1 THEN IFNULL(t_wydanie_poz_dost.ilosc,0) ELSE IFNULL(t_wydanie_poz_dost.ilosc_potwierdzona,0) END  AS ilosc_oczekiwana
                                FROM k_zam_poz_raport
                                LEFT JOIN `t_wydanie_poz_dost` ON (`t_wydanie_poz_dost`.`zam_poz_dost_id` = `k_zam_poz_raport`.`zam_poz_dost_id`)
                                LEFT JOIN `t_wydanie_nag_dost` ON (`t_wydanie_nag_dost`.`wydanie_nag_dost_id` = `t_wydanie_poz_dost`.`wydanie_nag_dost_id`)
                                LEFT JOIN `k_wydanie_poz_dost_temp_szczegoly` ON (`k_wydanie_poz_dost_temp_szczegoly`.`zam_poz_dost_id` = `k_zam_poz_raport`.`zam_poz_dost_id`)
                                WHERE k_zam_poz_raport.operacja_id=2 AND k_zam_poz_raport.kontrahent_id='.$kontrahent_id.' AND k_zam_poz_raport.ilosc_oczekiwana - CASE WHEN t_wydanie_nag_dost.status_id=1 THEN IFNULL(t_wydanie_poz_dost.ilosc,0) ELSE IFNULL(t_wydanie_poz_dost.ilosc_potwierdzona,0) END > 0 AND zam_nag_dost_id in('.$id.')',$uzytkownik_id);
        break;
    case 'k_zam_poz_raport_SUM_IN':
        $id = implode(",", $id);
        $output = GetDataQuery('SELECT GROUP_CONCAT(DISTINCT TRIM(numer_zam) ORDER BY numer_zam ASC SEPARATOR ",") as numer_zam , kontrahent_nazwa,kontrahent_id,wytwor_id,wytwor_idm,kod_wytwor,jm_idn,wytwor_nazwa, SUM(ilosc_oczekiwana) as ilosc_oczekiwana
                                FROM k_zam_poz_raport
                                WHERE operacja_id=2 AND zam_nag_dost_id IN ('.$id.')
                                GROUP BY kontrahent_nazwa,kontrahent_id,wytwor_id,wytwor_idm,kod_wytwor,jm_idn,wytwor_nazwa
                                ORDER BY wytwor_id',$uzytkownik_id);
        break;  
    case 'k_zam_poz_raport_IN':
        $id = implode(",", $id);
        $output = GetDataQuery('SELECT * FROM k_zam_poz_raport WHERE zam_nag_dost_id in('.$id.')',$uzytkownik_id);
        break;     
    case 'k_zam_poz_raport':
        $output = GetDataQuery('SELECT * FROM k_zam_poz_raport WHERE zam_nag_dost_id='.$id.'',$uzytkownik_id);
        break;                   
    default:
        $output = array('error'  => true,'message' => 'Brak danych.');
        break;
} 

echo json_encode($output);

