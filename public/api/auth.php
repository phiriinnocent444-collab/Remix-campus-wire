<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. GET /api/auth.php?action=me
if ($method === 'GET' && $action === 'me') {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
    $token = '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided.']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT id, email, real_name as realName, alias, university, campus, program, year, token FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired session.']);
        exit();
    }

    echo json_encode(['user' => $user]);
    exit();
}

// 2. POST /api/auth.php?action=register
if ($method === 'POST' && $action === 'register') {
    $body = json_decode(file_get_contents('php://input'), true);
    $email = isset($body['email']) ? trim($body['email']) : '';
    $password = isset($body['password']) ? $body['password'] : '';
    $university = isset($body['university']) ? trim($body['university']) : 'unza';
    $realName = isset($body['realName']) ? trim($body['realName']) : 'Student Scholar';
    $alias = isset($body['alias']) ? trim($body['alias']) : 'Scholar_' . rand(100, 999);
    $program = isset($body['program']) ? trim($body['program']) : 'Undergraduate Degree';
    $year = isset($body['year']) ? intval($body['year']) : 1;

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required.']);
        exit();
    }

    // Check existing
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'A student account with this email already exists on InfinityFree MySQL.']);
        exit();
    }

    $userId = 'user-' . time() . '-' . rand(100, 999);
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $token = 'tok_' . time() . '_' . bin2hex(random_bytes(16));

    $stmt = $pdo->prepare("INSERT INTO users (id, email, password_hash, real_name, alias, university, campus, program, year, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $userId,
        $email,
        $passwordHash,
        $realName,
        $alias,
        $university,
        'Main Campus',
        $program,
        $year,
        $token
    ]);

    http_response_code(201);
    echo json_encode([
        'message' => 'Student account registered successfully on InfinityFree.',
        'token' => $token,
        'user' => [
            'id' => $userId,
            'email' => $email,
            'realName' => $realName,
            'alias' => $alias,
            'university' => $university,
            'campus' => 'Main Campus',
            'program' => $program,
            'year' => $year
        ]
    ]);
    exit();
}

// 3. POST /api/auth.php?action=login
if ($method === 'POST' && ($action === 'login' || empty($action))) {
    $body = json_decode(file_get_contents('php://input'), true);
    $email = isset($body['email']) ? trim($body['email']) : '';
    $password = isset($body['password']) ? $body['password'] : '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required.']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid student email or password.']);
        exit();
    }

    $token = 'tok_' . time() . '_' . bin2hex(random_bytes(16));
    $upd = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
    $upd->execute([$token, $user['id']]);

    echo json_encode([
        'message' => 'Login successful on InfinityFree MySQL.',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'realName' => $user['real_name'],
            'alias' => $user['alias'],
            'university' => $user['university'],
            'campus' => $user['campus'],
            'program' => $user['program'],
            'year' => intval($user['year'])
        ]
    ]);
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Action not found']);
