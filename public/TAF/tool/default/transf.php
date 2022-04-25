<?php

require __DIR__ . '/vendor/autoload.php';

session_start();

// echo $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

//  __ajax-crypt-id__ = the id of the crypt when the server get a cipherText
//  __ajax-crypt-path__ = the redirect url
//  __ajax-client-key__ = the client public key
$avoidWord = array("__ajax-crypt-id__", "__ajax-crypt-path__", "__ajax-client-key__");



if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $method = $_POST;
    $methodName = "POST";
} else if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $method = $_GET;
    $methodName = "GET";
}

$url = $method['__ajax-crypt-path__'];
$retMethod = array();


if (isset($method["__ajax-crypt-id__"])) {
    $keypair = $_SESSION["keypair"][$method["__ajax-crypt-id__"]];
    foreach ($method as $key => $val) {
        // echo $key;
        if (in_array($key, $avoidWord)) {
            $method[$key] = $val;
            break;
        }
        if (is_array($val)) {
            $array = array();
            foreach ($val as $array_key => $array_val) {
                array_push($array, sodium_crypto_box_seal_open(hex2bin($array_val), $keypair));
            }
            $retMethod[$key] = $array;
        } else {
            $retMethod[$key] = sodium_crypto_box_seal_open(hex2bin($val), $keypair);
        }
    }
} else {
    foreach ($method as $key => $val) {
        if (in_array($key, $avoidWord)) {
            $method[$key] = $val;
            break;
        }
        $retMethod[$key] = $val;
    }
}

// set the method content to the good templte for GuzzleHttp\Client
// or set the url with the get content
$retMethod = array_map(
    function ($name, $val) {
        return ["name" => $name, "contents" => $val];
    },
    array_keys($retMethod),
    array_values($retMethod)
);


if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $url .= "?" . implode(
        "&",
        array_map(
            function ($val) {
                return $val["name"] . "=" . $val["contents"];
            },
            array_values($retMethod)
        )
    );
    $retMethod = array();
}

$totalArray = $retMethod;

// map the $_FILES
foreach ($_FILES as $name => $val) {
    $array = array();
    if (is_array($val["name"])) {
        for ($i = 0; $i < count($val["name"]); $i++) {
            if (!empty($val['tmp_name'][$i])) {
                array_push($array, ["name" => $name . "[]", 'contents' => file_get_contents($val["tmp_name"][$i]), 'filename' => $val["name"][$i]]);
            }
        }
    } else {
        // var_dump($val);
        if (!empty($val['tmp_name'])) {
            array_push($array, ["name" => $name, 'contents' => file_get_contents($val['tmp_name']), 'filename' => $val['name']]);
        }
    }
    array_push($totalArray, ...$array);
}

var_dump($totalArray);


$jar = new GuzzleHttp\Cookie\SessionCookieJar('CookieJar', true);
// Initialize Guzzle client
$client = new GuzzleHttp\Client();

// Create a POST request
$response = $client->request(
    $methodName,
    $url,
    [
        ['X-Request-With' => 'XMLHttpRequest'],
        ['cookies' => $jar],
        // 'form_params' => $_POST,
        'multipart' => array(
            ...$totalArray
        )
    ]
);

// Parse the response object, e.g. read the headers, body, etc.
$headers = $response->getHeaders();
$body = $response->getBody();

var_dump($CookieJar);

if (isset($method["__ajax-client-key__"])) {
    echo bin2Hex(sodium_crypto_box_seal($body, sodium_hex2bin($method["__ajax-client-key__"])));
} else {
    echo $body;
}
