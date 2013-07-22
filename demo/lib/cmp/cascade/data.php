<?php
    $type = $_GET['type'];
    $id = $_GET['id'];
    $province = Array(
        Array("value" => "100", "text" => "北京"),
        Array("value" => "101", "text" => "广东"),
        Array("value" => "102", "text" => "福建")
    );

    $city = Array(
        "100" => Array(
                    Array("value" => "1001", "text" => "北京")
        ),
        "101" => Array(
                    Array("value" => "1010", "text" => "广州"),
                    Array("value" => "1011", "text" => "深圳")
        ),
        "102" => Array(
                    Array("value" => "1020", "text" => "福州"),
                    Array("value" => "1021", "text" => "厦门"),
                    Array("value" => "1022", "text" => "泉州")
        )
    );

    $county = Array(
        "1001" => Array(
                    Array("value" => "10010", "text" => "东城区"),
                    Array("value" => "10011", "text" => "西城区"),
                    Array("value" => "10012", "text" => "崇文区"),
                    Array("value" => "10013", "text" => "宣武区")
        ),

        "1010" => Array(
                    Array("value" => "10100", "text" => "天河区"),
                    Array("value" => "10101", "text" => "越秀区")
        ),

        "1011" => Array(
                    Array("value" => "10110", "text" => "福田区"),
                    Array("value" => "10111", "text" => "罗湖区"),
                    Array("value" => "10112", "text" => "南山区")
        ),

        "1020" => Array(
                    Array("value" => "10200", "text" => "鼓楼区"),
                    Array("value" => "10201", "text" => "台江区"),
                    Array("value" => "10202", "text" => "闽侯县")
        ),

        "1021" => Array(
                    Array("value" => "10210", "text" => "思明区"),
                    Array("value" => "10211", "text" => "翔安区"),
                    Array("value" => "10212", "text" => "海沧区")
        ),

        "1022" => Array(
                    Array("value" => "10220", "text" => "梅列区"),
                    Array("value" => "10221", "text" => "三元区")
        )
    );

    $result;
    if($type == "province") {
        $result = $province;
    } else if($type == "city") {
        $result = $city[$id];
    } else {
        $result = $county[$id];
    }
    echo json_encode(Array(
        "code" => 200,
        "data" => $result
    ));
    exit;