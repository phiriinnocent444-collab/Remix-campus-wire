<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $pdo = getDbConnection();
    $postCount = $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    
    echo json_encode([
        'status' => 'online',
        'server' => 'InfinityFree Apache / PHP ' . phpversion(),
        'database' => 'InfinityFree MySQL (Connected via PDO)',
        'fullStack' => true,
        'totalPosts' => intval($postCount),
        'totalUsers' => intval($userCount),
        'timestamp' => date('c')
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'degraded',
        'server' => 'InfinityFree Apache / PHP ' . phpversion(),
        'database' => 'Disconnected: ' . $e->getMessage(),
        'timestamp' => date('c')
    ]);
}
