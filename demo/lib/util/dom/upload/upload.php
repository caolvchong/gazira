<?php
header('Content-type: application/json');
$id = rand(100000, 999999);
move_uploaded_file($_FILES["Filedata"]["tmp_name"], "/home/home/Desktop/temp/upload" . $_FILES["upfile"]["name"]);
$result = Array(
    "code" => 200,
    "data" => Array(
        "id" => $id,
        "post" => $_POST,
        "file" => $_FILES
    )
);
echo json_encode($result);