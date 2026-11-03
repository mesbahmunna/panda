<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Only POST method is allowed"]);
    exit();
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "No valid image file uploaded"]);
    exit();
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(["success" => false, "message" => "Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed"]);
    exit();
}

// Upload directory in public folder
$targetDir = __DIR__ . '/../public/products/';
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Generate unique clean filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$baseName = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
$newFileName = 'up_' . time() . '_' . substr(md5(uniqid()), 0, 6) . '.' . strtolower($ext);
$targetFilePath = $targetDir . $newFileName;

if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
    // Determine public URL
    $isBabySubdir = strpos($_SERVER['REQUEST_URI'], '/baby/') !== false;
    $publicUrl = ($isBabySubdir ? '/baby' : '') . '/products/' . $newFileName;
    
    echo json_encode([
        "success" => true,
        "url" => $publicUrl,
        "fileName" => $newFileName
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save uploaded file to disk"]);
}
