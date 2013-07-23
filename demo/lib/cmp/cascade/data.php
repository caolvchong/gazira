<?php
    $type = $_GET['type'];
    $id = $_GET['id'];
    $province = Array(
        Array("id" => "100", "name" => "北京"),
        Array("id" => "101", "name" => "广东"),
        Array("id" => "102", "name" => "福建")
    );

    $city = Array(
        "100" => Array(
                    Array("id" => "1001", "name" => "北京")
        ),
        "101" => Array(
                    Array("id" => "1010", "name" => "广州"),
                    Array("id" => "1011", "name" => "深圳")
        ),
        "102" => Array(
                    Array("id" => "1020", "name" => "福州"),
                    Array("id" => "1021", "name" => "厦门"),
                    Array("id" => "1022", "name" => "泉州")
        )
    );

    $county = Array(
        "1001" => Array(
                    Array("id" => "10010", "name" => "东城区"),
                    Array("id" => "10011", "name" => "西城区"),
                    Array("id" => "10012", "name" => "崇文区"),
                    Array("id" => "10013", "name" => "宣武区")
        ),

        "1010" => Array(
                    Array("id" => "10100", "name" => "天河区"),
                    Array("id" => "10101", "name" => "越秀区")
        ),

        "1011" => Array(
                    Array("id" => "10110", "name" => "福田区"),
                    Array("id" => "10111", "name" => "罗湖区"),
                    Array("id" => "10112", "name" => "南山区")
        ),

        "1020" => Array(
                    Array("id" => "10200", "name" => "鼓楼区"),
                    Array("id" => "10201", "name" => "台江区"),
                    Array("id" => "10202", "name" => "闽侯县")
        ),

        "1021" => Array(
                    Array("id" => "10210", "name" => "思明区"),
                    Array("id" => "10211", "name" => "翔安区"),
                    Array("id" => "10212", "name" => "海沧区")
        ),

        "1022" => Array(
                    Array("id" => "10220", "name" => "梅列区"),
                    Array("id" => "10221", "name" => "三元区")
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