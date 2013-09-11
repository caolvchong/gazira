<?php
    sleep(0);
    $data = Array();
    for($i = 0; $i< 5; $i++) {
        $data[] = Array(
            "content" => "小明".$i,
            "id" => $i,
            "xxx" => "xxx".$i
        );
    }
    $arr = Array(
        code => 200,
        data => $data
    );
    echo json_encode($arr);
