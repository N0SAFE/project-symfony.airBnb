<?php

$content = trim(file_get_contents("php://input"));  

if(!isset($_POST["path"])){
    echo "error";
}
else{
    echo file_exists("../../" . $_POST["path"]) ? "good" : "error";
}