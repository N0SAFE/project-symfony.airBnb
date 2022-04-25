<?php

require __DIR__ . '/vendor/autoload.php';

session_start();

// echo $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

//  __ajax-crypt-id__ = the id of the crypt when the server get a cipherText
//  __ajax-crypt-path__ = the redirect url
//  __ajax-client-key__ = the client public key
$avoidWord = array("__ajax-crypt-id__", "__ajax-crypt-path__", "__ajax-client-key__");


echo "request";
var_dump($_REQUEST);

$_REQUEST["other"] = "ui";

var_dump($_REQUEST);

var_dump($_COOKIE);

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $method = $_POST;
    $methodName = "POST";
} else if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $method = $_GET;
    $methodName = "GET";
}


if (isset($method["__ajax-crypt-id__"])) {
    $keypair = $_SESSION["keypair"][$method["__ajax-crypt-id__"]];
    $func = function ($array, $func) use ($avoidWord, $keypair) {
        $retArray = array();
        foreach ($array as $key => $val) {
            if (!in_array($key, $avoidWord)) {
                if (is_array($val)) {
                    array_push($retArray, $func($val, $func));
                } else {
                    array_push($retArray, sodium_crypto_box_seal_open(hex2bin($val), $keypair));
                    echo sodium_crypto_box_seal_open(hex2bin($val), $keypair);
                }
            }
        }
        return $retArray;
    };
    $_POST = $func($_POST, $func);
    // var_dump($func($_POST, $func));
}

echo $method['__ajax-crypt-path__'];



$GLOBALS["other"] = "ui";


// $url = $method['__ajax-crypt-path__'];
// $retMethod = array();


// var_dump($_POST);




header('HTTP/1.1 308 Temporary Redirect');
header("location: " . $method['__ajax-crypt-path__']);
