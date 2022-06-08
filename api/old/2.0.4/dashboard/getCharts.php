<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config.php';
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
mysqli_set_charset($mysqli, "utf8");
$data_all=array();
$label_data =array();
$data_chart_ilosc =array();
$label_status_nazwa = array();
$data_chart_ilosc_s = array();
$data = array();
$data1 = array();


$query_canvas="SELECT CONVERT(data_realizacji_magazyn,DATE) as data_realizacji_magazyn, COUNT(zam_nag_dost_id) as ilosc 
    FROM t_zam_nag_dost 
    WHERE data_realizacji_magazyn IS NOT NULL AND operacja_id=1
    GROUP BY CONVERT(data_realizacji_magazyn,DATE)
    ORDER BY data_realizacji_magazyn DESC
    LIMIT 10";

$result = mysqli_query($mysqli,$query_canvas);   


$query_canvas1="SELECT t_zam_status.status_nazwa, COUNT(zam_nag_dost_id) as ilosc  FROM t_zam_status
    LEFT JOIN t_zam_nag_dost ON t_zam_status.status_id = t_zam_nag_dost.status_id
    GROUP BY t_zam_status.status_nazwa";

$result1 = mysqli_query($mysqli,$query_canvas1);   



    while ($row_users = mysqli_fetch_assoc($result )) {
        $array_data = $row_users['data_realizacji_magazyn'];
        $array_ilosc= $row_users['ilosc'];

        array_push($label_data,$array_data);
        array_push($data_chart_ilosc,$array_ilosc);

      $data = [
            'chart_name' => 'canvas',
            'chart_data' => [
                'type' => 'bar',
                'data' => [
                    'labels' => $label_data,
                    'datasets' => [[
                        'data' =>$data_chart_ilosc,
                        'backgroundColor' => ['#e53935','#d81b60','#8e24aa','#5e35b1','#1e88e5','#00acc1','#43a047','#fdd835','#f4511e','#7cb342'],
                        'label' => 'Ilość zamówień'
                    ]],                     
                    ],
                'options' => [
                    'title' => [
                      'display'=> false,
                      'text'=> 'Zamówienia surowców',
                      'fontSize' => 26
                    ] ,
                    'scales'=> [
                        'xAxes'=> [[
                          'display'=> true
                          ]],
                        'yAxes'=> [[
                          'display'=> true
                          ,
                            'ticks'=> [
                                'max'=> 5,
                                'min'=> 0,
                                'stepSize'=> 1
                            ]
                          ]],
                          ]
                ]
            ],
      ];
      
      
    }
  array_push($data_all,$data);
    while ($row = mysqli_fetch_assoc($result1 )) {
        $array_status_nazwa = $row['status_nazwa'];
        $array_ilosc_s= $row['ilosc'];

        array_push($label_status_nazwa,$array_status_nazwa);
        array_push($data_chart_ilosc_s,$array_ilosc_s);


        $data1 = [
            'chart_name' => 'canvas1',
            'chart_data' => [
                'type' => 'pie',
                'data' => [
                    'labels' => $label_status_nazwa,
                    'datasets' => [[
                        'data' =>$data_chart_ilosc_s,
                        'backgroundColor' => ['#e53935','#d81b60','#8e24aa','#5e35b1','#1e88e5','#00acc1','#43a047','#fdd835','#f4511e','#7cb342'],
                        
                    ]],                     
                    ],
                'options' => [
                    'title' => [
                      'display'=> false,
                      'text'=> 'Zamówienia surowców',
                      'fontSize' => 26
                    ],
                    'scales'=> [
                        'xAxes'=> [[
                          'display'=> false
                          ]],
                        'yAxes'=> [[
                          'display'=> false
                          ,
                            'ticks'=> [
                                'max'=> 5,
                                'min'=> 0,
                                'stepSize'=> 1
                            ]
                          ]],
                          ]
                ]
            ],
        ];

        
    }

array_push($data_all,$data1);
$output = array('error'  => false,'message' => 'Prawidłowo przesłano dane.','data' => $data_all);
echo json_encode($output);