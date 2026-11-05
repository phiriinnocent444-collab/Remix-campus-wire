<?php
require_once __DIR__ . '/config.php';

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        initTablesIfMissing($pdo);
        return $pdo;
    } catch (PDOException $e) {
        // Fallback or detailed friendly JSON response
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed on InfinityFree.',
            'message' => $e->getMessage(),
            'hint' => 'Verify DB_HOST, DB_NAME, DB_USER, and DB_PASS in public/api/config.php'
        ]);
        exit();
    }
}

function initTablesIfMissing(PDO $pdo) {
    // 1. Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        real_name VARCHAR(120),
        alias VARCHAR(120) NOT NULL,
        university VARCHAR(64) NOT NULL,
        campus VARCHAR(120),
        program VARCHAR(150),
        year INT DEFAULT 1,
        token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 2. Posts Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        university VARCHAR(64) NOT NULL,
        campus_branch VARCHAR(120),
        category VARCHAR(64) NOT NULL,
        author_alias VARCHAR(120) NOT NULL,
        is_anonymous TINYINT(1) DEFAULT 1,
        upvotes INT DEFAULT 1,
        downvotes INT DEFAULT 0,
        comments_count INT DEFAULT 0,
        tags VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 3. Comments Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(64) PRIMARY KEY,
        post_id VARCHAR(64) NOT NULL,
        author_alias VARCHAR(120) NOT NULL,
        author_university VARCHAR(64) NOT NULL,
        content TEXT NOT NULL,
        upvotes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_post_id (post_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
}
