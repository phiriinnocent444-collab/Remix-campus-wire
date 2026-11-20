<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $pdo = getDbConnection();
    $driver = getActiveDbDriver();
    $postCount = $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $pollCount = $pdo->query("SELECT COUNT(*) FROM polls")->fetchColumn();

    $dbLabel = $driver === 'mysql'
        ? 'InfinityFree MySQL (Connected via PDO)'
        : 'InfinityFree SQLite Auto-Engine (api/data/campus.db)';

    echo json_encode([
        'status' => 'online',
        'server' => 'InfinityFree Apache / PHP ' . phpversion(),
        'database' => $dbLabel,
        'driver' => $driver,
        'fullStack' => true,
        'totalPosts' => intval($postCount),
        'totalUsers' => intval($userCount),
        'totalPolls' => intval($pollCount),
        'timestamp' => date('c'),
        'infinityFreeReady' => true
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'degraded',
        'server' => 'InfinityFree Apache / PHP ' . phpversion(),
        'database' => 'Disconnected: ' . $e->getMessage(),
        'timestamp' => date('c')
    ]);
}
