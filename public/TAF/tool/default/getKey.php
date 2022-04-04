<?php

session_start();

$keypair = sodium_crypto_box_keypair();
$public_key = sodium_crypto_box_publickey($keypair);

$id = uniqid();

$_SESSION["keypair"] = array($id => $keypair);

echo sodium_bin2hex($public_key) . ";;;" . $id;