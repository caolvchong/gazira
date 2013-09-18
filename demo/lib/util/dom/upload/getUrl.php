<?php
    sleep(3);
    $result = Array(
        "code" => 200,
        "data" => 'upload.php?t='.rand(100000, 999999)
    );
    echo json_encode($result);