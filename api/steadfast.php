<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Api-Key, Secret-Key, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$BASE_URL = 'https://portal.packzy.com/api/v1';

// Default keys if not supplied in incoming headers
$DEFAULT_API_KEY = '5a6jjgtod15mg68pdp3pewjae9zu4k8g';
$DEFAULT_SECRET_KEY = 'rygkmut7erremcmoeczyewi3';

// Extract keys from request headers or fall back to defaults
$headers = getallheaders();
$apiKey = !empty($headers['Api-Key']) ? $headers['Api-Key'] : (!empty($headers['api-key']) ? $headers['api-key'] : $DEFAULT_API_KEY);
$secretKey = !empty($headers['Secret-Key']) ? $headers['Secret-Key'] : (!empty($headers['secret-key']) ? $headers['secret-key'] : $DEFAULT_SECRET_KEY);

// Determine action and route
$action = isset($_GET['action']) ? trim($_GET['action']) : '';

if (empty($action)) {
    echo json_encode(['status' => 400, 'message' => 'Missing action parameter']);
    exit();
}

// Helper to make cURL request to Steadfast
function makeSteadfastRequest($url, $method = 'GET', $payload = null, $apiKey = '', $secretKey = '') {
    $ch = curl_init($url);
    $reqHeaders = [
        'Content-Type: application/json',
        'Accept: application/json',
        'Api-Key: ' . $apiKey,
        'Secret-Key: ' . $secretKey
    ];

    curl_setopt($ch, CURLOPT_HTTPHEADER, $reqHeaders);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($payload) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($payload) ? $payload : json_encode($payload));
        }
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return [
            'http_code' => 500,
            'body' => json_encode(['status' => 500, 'message' => 'Steadfast cURL failed: ' . $curlError])
        ];
    }

    return [
        'http_code' => $httpCode,
        'body' => $response
    ];
}

$rawInput = file_get_contents('php://input');

switch ($action) {
    case 'ping':
        $res = makeSteadfastRequest("$BASE_URL/ping", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'balance':
        $res = makeSteadfastRequest("$BASE_URL/get_balance", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'payments':
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $res = makeSteadfastRequest("$BASE_URL/payments?page=$page", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'fraud_check':
        $phone = isset($_GET['phone']) ? preg_replace('/[^0-9]/', '', $_GET['phone']) : '';
        if (empty($phone)) {
            http_response_code(400);
            echo json_encode(['status' => 400, 'message' => 'Phone number is required']);
            exit();
        }
        $res = makeSteadfastRequest("$BASE_URL/fraud_check/score/$phone", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'create_order':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['status' => 405, 'message' => 'Method not allowed']);
            exit();
        }
        $res = makeSteadfastRequest("$BASE_URL/create_order", 'POST', $rawInput, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'bulk_order':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['status' => 405, 'message' => 'Method not allowed']);
            exit();
        }
        $res = makeSteadfastRequest("$BASE_URL/create_order/bulk-order/extended", 'POST', $rawInput, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'status_by_tracking':
        $code = isset($_GET['code']) ? urlencode($_GET['code']) : '';
        if (empty($code)) {
            http_response_code(400);
            echo json_encode(['status' => 400, 'message' => 'Tracking code is required']);
            exit();
        }
        $res = makeSteadfastRequest("$BASE_URL/status_by_trackingcode/$code", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'status_by_cid':
        $cid = isset($_GET['cid']) ? (int)$_GET['cid'] : 0;
        $res = makeSteadfastRequest("$BASE_URL/status_by_cid/$cid", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'status_with_return':
        $cid = isset($_GET['cid']) ? (int)$_GET['cid'] : 0;
        $res = makeSteadfastRequest("$BASE_URL/status_with_return_status_by_cid/$cid", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'trackings_by_invoice':
        $invoice = isset($_GET['invoice']) ? urlencode($_GET['invoice']) : '';
        if (empty($invoice)) {
            http_response_code(400);
            echo json_encode(['status' => 400, 'message' => 'Invoice is required']);
            exit();
        }
        $res = makeSteadfastRequest("$BASE_URL/trackings_by_invoice/$invoice", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'create_return_request':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['status' => 405, 'message' => 'Method not allowed']);
            exit();
        }
        $res = makeSteadfastRequest("$BASE_URL/create_return_request", 'POST', $rawInput, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    case 'police_stations':
        $res = makeSteadfastRequest("$BASE_URL/police_stations", 'GET', null, $apiKey, $secretKey);
        http_response_code($res['http_code']);
        echo $res['body'];
        break;

    default:
        http_response_code(404);
        echo json_encode(['status' => 404, 'message' => "Unknown action: $action"]);
        break;
}
