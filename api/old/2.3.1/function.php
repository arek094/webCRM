<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


function GetDataQuery($query,$uzytkownik_id){
    require_once 'config.php';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($mysqli, "utf8");

    $result = mysqli_query($mysqli, $query ) or die(mysqli_error($mysqli));

    if (isset($result)){

        $data_query = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $rowcount=mysqli_num_rows($result);
        mysqli_free_result($result);

        if($rowcount == 0) {
            $output = array('error'  => true,'message' => 'Brak danych.');
        } else {
            $output = array('error'  => false,'message' => 'Prawidłowo przesłano dane.','data'=> $data_query);
        }
  
    } else{
        $output = array('error'  => true,'message' => 'Brak danych.');
    }

    return $output;

}



function GetDataQueryPosition($query,$query_poz,$string_name_id,$uzytkownik_id){
    require_once 'config.php';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($mysqli, "utf8");
    
    $data_output_array = array();

    $result = mysqli_query($mysqli, $query ) or die(mysqli_error($mysqli));

    if (isset($result)){

        $data_query = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $rowcount=mysqli_num_rows($result);
        mysqli_free_result($result);

        if ($rowcount == 1){
            foreach ($data_query as $row) 
            { 
                    $row['item'] = array();
                    $result_poz = mysqli_query($mysqli, "$query_poz".$row[''.$string_name_id.'']."") or die(mysqli_error($mysqli));
                    $data_query_poz = mysqli_fetch_all($result_poz, MYSQLI_ASSOC);
                    $row['item'] = array_merge($row['item'], $data_query_poz);  
                    $output = array('error'  => false,'message' => 'Prawidłowo przesłano dane.','data'=> $row);       
            }

        } else {
            foreach ($data_query as $row) 
            { 
                    $row['item'] = array();
                    $result_poz = mysqli_query($mysqli, "$query_poz".$row[''.$string_name_id.'']."") or die(mysqli_error($mysqli));
                    $data_query_poz = mysqli_fetch_all($result_poz, MYSQLI_ASSOC);
                    $row['item'] = array_merge($row['item'], $data_query_poz); 
                    array_push($data_output_array,$row);     
                    $output = array('error'  => false,'message' => 'Prawidłowo przesłano dane.','data'=> $data_output_array);       
            }
        }
      
    } else{
        $output = array('error'  => true,'message' => 'Brak danych.');
    }


    return $output;

}