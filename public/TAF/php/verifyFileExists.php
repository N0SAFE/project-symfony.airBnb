<?php

$content = trim(file_get_contents("php://input"));

echo file_exists("../../".$content) ? "good":"error";