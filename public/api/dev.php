<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$driver = getActiveDbDriver();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. GET /api/dev/schema -> relational table definitions
if ($method === 'GET' && $action === 'schema') {
    $usersCount = intval($pdo->query("SELECT COUNT(*) FROM users")->fetchColumn());
    $postsCount = intval($pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn());
    $pollsCount = intval($pdo->query("SELECT COUNT(*) FROM polls")->fetchColumn());

    echo json_encode([
        'database' => $driver === 'mysql' ? 'InfinityFree MySQL (PDO)' : 'InfinityFree SQLite (campus.db)',
        'driver' => $driver,
        'tables' => [
            [
                'name' => 'users',
                'description' => 'Registered university students across UNZA, CBU, Mulungushi, etc.',
                'rowCount' => $usersCount,
                'columns' => [
                    ['name' => 'id', 'type' => 'VARCHAR(64)', 'isPrimaryKey' => true, 'nullable' => false, 'description' => 'Unique student identifier'],
                    ['name' => 'email', 'type' => 'VARCHAR(191)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Verified student university email'],
                    ['name' => 'real_name', 'type' => 'VARCHAR(120)', 'isPrimaryKey' => false, 'nullable' => true, 'description' => 'Student full legal name'],
                    ['name' => 'alias', 'type' => 'VARCHAR(120)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Public or anonymous campus handle'],
                    ['name' => 'university', 'type' => 'VARCHAR(64)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'University acronym (unza, cbu, etc.)'],
                    ['name' => 'program', 'type' => 'VARCHAR(150)', 'isPrimaryKey' => false, 'nullable' => true, 'description' => 'Academic program of study'],
                    ['name' => 'year', 'type' => 'INT', 'isPrimaryKey' => false, 'nullable' => true, 'description' => 'Academic year (1-7)'],
                    ['name' => 'created_at', 'type' => 'TIMESTAMP', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Account creation date'],
                ],
            ],
            [
                'name' => 'posts',
                'description' => 'Campus discussions, academic notices, and student whispers',
                'rowCount' => $postsCount,
                'columns' => [
                    ['name' => 'id', 'type' => 'VARCHAR(64)', 'isPrimaryKey' => true, 'nullable' => false, 'description' => 'Unique post identifier'],
                    ['name' => 'title', 'type' => 'VARCHAR(255)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Post heading'],
                    ['name' => 'content', 'type' => 'TEXT', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Body text content'],
                    ['name' => 'university', 'type' => 'VARCHAR(64)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Target campus filter'],
                    ['name' => 'category', 'type' => 'VARCHAR(64)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Category (exams, events, gossip, etc.)'],
                    ['name' => 'author_alias', 'type' => 'VARCHAR(120)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Author display name'],
                    ['name' => 'upvotes', 'type' => 'INT', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Total upvotes count'],
                    ['name' => 'downvotes', 'type' => 'INT', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Total downvotes count'],
                    ['name' => 'comments_count', 'type' => 'INT', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Total comments count'],
                    ['name' => 'created_at', 'type' => 'TIMESTAMP', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Creation timestamp'],
                ],
            ],
            [
                'name' => 'polls',
                'description' => 'Campus community polls and voting analytics',
                'rowCount' => $pollsCount,
                'columns' => [
                    ['name' => 'id', 'type' => 'VARCHAR(64)', 'isPrimaryKey' => true, 'nullable' => false, 'description' => 'Unique poll ID'],
                    ['name' => 'question', 'type' => 'TEXT', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Poll survey prompt'],
                    ['name' => 'university', 'type' => 'VARCHAR(64)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Target university'],
                    ['name' => 'total_votes', 'type' => 'INT', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Sum of all options votes'],
                    ['name' => 'closing_date', 'type' => 'VARCHAR(32)', 'isPrimaryKey' => false, 'nullable' => false, 'description' => 'Poll expiration date'],
                ],
            ],
        ],
    ]);
    exit();
}

// 2. GET /api/dev/endpoints -> endpoint catalog
if ($method === 'GET' && $action === 'endpoints') {
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';

    echo json_encode([
        'title' => 'ZedWhisper University Live PHP REST API Catalog',
        'baseUrl' => $scheme . '://' . $host,
        'endpoints' => [
            ['path' => '/api/health', 'method' => 'GET', 'description' => 'Server health check, database driver status, total record counts'],
            ['path' => '/api/posts', 'method' => 'GET', 'description' => 'List posts with optional filters (?university=unza&category=exams&sortBy=trending)'],
            ['path' => '/api/posts', 'method' => 'POST', 'description' => 'Publish a new campus post or discussion thread'],
            ['path' => '/api/posts/:id/vote', 'method' => 'POST', 'description' => 'Upvote or downvote an existing post'],
            ['path' => '/api/polls', 'method' => 'GET', 'description' => 'Get active university survey polls'],
            ['path' => '/api/dev/sql', 'method' => 'POST', 'description' => 'Execute read-only SQL queries against student database tables'],
            ['path' => '/api/dev/schema', 'method' => 'GET', 'description' => 'Get relational database schema definitions'],
        ],
    ]);
    exit();
}

// 3. POST /api/dev/sql -> Safe read-only SQL sandbox executor
if ($method === 'POST' && $action === 'sql') {
    $start = microtime(true);
    $body = json_decode(file_get_contents('php://input'), true);
    $rawSql = isset($body['sql']) ? trim($body['sql']) : '';

    if (empty($rawSql)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Empty SQL query. Try: SELECT * FROM posts LIMIT 10;',
            'executionTimeMs' => 0,
        ]);
        exit();
    }

    $sql = rtrim($rawSql, "; \t\n\r\0\x0B");
    $normalized = strtolower($sql);

    // SHOW TABLES / \dt
    if (strpos($normalized, 'show tables') === 0 || strpos($normalized, '\\dt') === 0) {
        $usersCount = intval($pdo->query("SELECT COUNT(*) FROM users")->fetchColumn());
        $postsCount = intval($pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn());
        $pollsCount = intval($pdo->query("SELECT COUNT(*) FROM polls")->fetchColumn());
        $engineLabel = $driver === 'mysql' ? 'InfinityFree InnoDB (MySQL)' : 'SQLite 3';

        $elapsed = round((microtime(true) - $start) * 1000);
        echo json_encode([
            'success' => true,
            'query' => $sql,
            'columns' => ['table_name', 'engine', 'records'],
            'rows' => [
                ['table_name' => 'users', 'engine' => $engineLabel, 'records' => $usersCount],
                ['table_name' => 'posts', 'engine' => $engineLabel, 'records' => $postsCount],
                ['table_name' => 'polls', 'engine' => $engineLabel, 'records' => $pollsCount],
            ],
            'rowCount' => 3,
            'executionTimeMs' => $elapsed,
        ]);
        exit();
    }

    // Strict SELECT sandbox
    if (strpos($normalized, 'select') !== 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Unsupported query type in sandbox. Supported: SELECT ... FROM [users|posts|polls] [WHERE ...] [ORDER BY ...] [LIMIT ...], or SHOW TABLES.',
            'executionTimeMs' => round((microtime(true) - $start) * 1000),
        ]);
        exit();
    }

    // Determine allowed table and safe columns (exclude password_hash & token!)
    $allowedTables = [
        'users' => ['id', 'email', 'real_name', 'alias', 'university', 'program', 'year', 'created_at'],
        'posts' => ['id', 'title', 'university', 'category', 'author_alias', 'upvotes', 'downvotes', 'comments_count', 'created_at'],
        'polls' => ['id', 'question', 'university', 'total_votes', 'closing_date', 'category'],
    ];

    $targetTable = null;
    if (preg_match('/\bfrom\s+(users|posts|polls)\b/i', $normalized, $tMatch)) {
        $targetTable = strtolower($tMatch[1]);
    }

    if (!$targetTable || !isset($allowedTables[$targetTable])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => "Table not found. Available tables in ZedWhisper schema: 'users', 'posts', 'polls'.",
            'executionTimeMs' => round((microtime(true) - $start) * 1000),
        ]);
        exit();
    }

    $validCols = $allowedTables[$targetTable];

    // Parse SELECT column list safely
    $selectCols = $validCols;
    if (preg_match('/^select\s+(.+?)\s+from\b/i', $sql, $sMatch)) {
        $rawColList = trim($sMatch[1]);
        if ($rawColList !== '*') {
            $requested = array_map('trim', explode(',', $rawColList));
            $filtered = [];
            foreach ($requested as $c) {
                $cLower = strtolower($c);
                if (in_array($cLower, $validCols, true)) {
                    $filtered[] = $cLower;
                }
            }
            if (!empty($filtered)) {
                $selectCols = $filtered;
            }
        }
    }

    $querySql = 'SELECT ' . implode(', ', $selectCols) . ' FROM ' . $targetTable;
    $params = [];

    // Safe WHERE clause: column (= | != | > | < | LIKE) value
    if (preg_match('/\bwhere\s+([a-z_]+)\s*(=|!=|>|<|like)\s*([\'"]?)([^\'";]+)\3/i', $sql, $wMatch)) {
        $wCol = strtolower($wMatch[1]);
        $wOp = strtoupper($wMatch[2]);
        $wVal = trim($wMatch[4]);
        if (in_array($wCol, $validCols, true)) {
            if ($wOp === 'LIKE') {
                $querySql .= " WHERE {$wCol} LIKE ?";
                $params[] = (strpos($wVal, '%') === false) ? "%{$wVal}%" : $wVal;
            } else {
                $querySql .= " WHERE {$wCol} {$wOp} ?";
                $params[] = $wVal;
            }
        }
    }

    // Safe ORDER BY clause
    if (preg_match('/\border\s+by\s+([a-z_]+)(?:\s+(asc|desc))?/i', $sql, $oMatch)) {
        $oCol = strtolower($oMatch[1]);
        $oDir = (isset($oMatch[2]) && strtoupper($oMatch[2]) === 'DESC') ? 'DESC' : 'ASC';
        if (in_array($oCol, $validCols, true)) {
            $querySql .= " ORDER BY {$oCol} {$oDir}";
        }
    }

    // Safe LIMIT clause
    $limit = 50;
    if (preg_match('/\blimit\s+(\d+)/i', $sql, $lMatch)) {
        $limit = max(1, min(100, intval($lMatch[1])));
    }
    $querySql .= " LIMIT {$limit}";

    try {
        $stmt = $pdo->prepare($querySql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        $columns = !empty($rows) ? array_keys($rows[0]) : $selectCols;

        $elapsed = round((microtime(true) - $start) * 1000);
        echo json_encode([
            'success' => true,
            'query' => $sql,
            'columns' => $columns,
            'rows' => $rows,
            'rowCount' => count($rows),
            'executionTimeMs' => $elapsed,
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'executionTimeMs' => round((microtime(true) - $start) * 1000),
        ]);
    }
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Invalid Dev Lab endpoint.']);
