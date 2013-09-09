<?php
    sleep(0);
    $data = Array();
    for($i = 0; $i< 5; $i++) {
        $data[] = Array(
            "value" => "小明".$i
        );
    }
    $arr = Array(
        code => 200,
        data => $data
    );
    echo json_encode($arr);
