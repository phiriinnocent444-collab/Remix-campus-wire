<?php
require_once __DIR__ . '/config.php';

$GLOBALS['zed_active_db_driver'] = 'sqlite';

function getActiveDbDriver() {
    return isset($GLOBALS['zed_active_db_driver']) ? $GLOBALS['zed_active_db_driver'] : 'sqlite';
}

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    // 1. Try InfinityFree MySQL first if credentials have been customized
    $hasCustomMysql = defined('DB_HOST')
        && DB_HOST !== 'sql102.epizy.com'
        && defined('DB_PASS')
        && DB_PASS !== 'YourVPanelPasswordHere'
        && !empty(DB_NAME)
        && !empty(DB_USER);

    if ($hasCustomMysql) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            $GLOBALS['zed_active_db_driver'] = 'mysql';
            initTablesIfMissing($pdo, 'mysql');
            seedDefaultDataIfEmpty($pdo);
            return $pdo;
        } catch (PDOException $e) {
            // Fall back to SQLite if MySQL credentials are still propagating or unreachable
        }
    }

    // 2. Auto-fallback to SQLite (zero configuration required on InfinityFree)
    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    $sqliteFile = $dataDir . '/campus.db';

    try {
        $pdo = new PDO("sqlite:" . $sqliteFile, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $GLOBALS['zed_active_db_driver'] = 'sqlite';
        initTablesIfMissing($pdo, 'sqlite');
        seedDefaultDataIfEmpty($pdo);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed.',
            'message' => $e->getMessage(),
            'hint' => 'Ensure write permissions on api/data/ or configure MySQL in api/config.php'
        ]);
        exit();
    }
}

function initTablesIfMissing(PDO $pdo, $driver = 'mysql') {
    if ($driver === 'mysql') {
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

        $pdo->exec("CREATE TABLE IF NOT EXISTS polls (
            id VARCHAR(64) PRIMARY KEY,
            question TEXT NOT NULL,
            university VARCHAR(64) NOT NULL,
            total_votes INT DEFAULT 0,
            closing_date VARCHAR(32) NOT NULL,
            category VARCHAR(64) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS poll_options (
            id VARCHAR(64) PRIMARY KEY,
            poll_id VARCHAR(64) NOT NULL,
            text VARCHAR(255) NOT NULL,
            votes INT DEFAULT 0,
            INDEX idx_poll_id (poll_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    } else {
        $pdo->exec("CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            password_hash TEXT,
            real_name TEXT,
            alias TEXT,
            university TEXT,
            campus TEXT,
            program TEXT,
            year INTEGER DEFAULT 1,
            token TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );");

        $pdo->exec("CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            title TEXT,
            content TEXT,
            university TEXT,
            campus_branch TEXT,
            category TEXT,
            author_alias TEXT,
            is_anonymous INTEGER DEFAULT 1,
            upvotes INTEGER DEFAULT 1,
            downvotes INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            tags TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );");

        $pdo->exec("CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            post_id TEXT,
            author_alias TEXT,
            author_university TEXT,
            content TEXT,
            upvotes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );");

        $pdo->exec("CREATE TABLE IF NOT EXISTS polls (
            id TEXT PRIMARY KEY,
            question TEXT,
            university TEXT,
            total_votes INTEGER DEFAULT 0,
            closing_date TEXT,
            category TEXT
        );");

        $pdo->exec("CREATE TABLE IF NOT EXISTS poll_options (
            id TEXT PRIMARY KEY,
            poll_id TEXT,
            text TEXT,
            votes INTEGER DEFAULT 0
        );");
    }
}

function seedDefaultDataIfEmpty(PDO $pdo) {
    // Seed default demo user
    $userCount = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO users (id, email, password_hash, real_name, alias, university, campus, program, year, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            'user-default-1',
            'student@unza.zm',
            password_hash('pass123', PASSWORD_BCRYPT),
            'Innocent Phiri',
            'ZedScholar_ZM',
            'unza',
            'Great East Road Campus',
            'Computer Science',
            3,
            'tok_demo_zed_unza_998'
        ]);
    }

    // Seed initial posts and comments
    $postCount = (int)$pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
    if ($postCount === 0) {
        $pStmt = $pdo->prepare("INSERT INTO posts (id, title, content, university, campus_branch, category, author_alias, is_anonymous, upvotes, downvotes, comments_count, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $pStmt->execute([
            'post-live-1',
            'UNZA Main Library Exam Night Study Guidelines & WiFi Boost',
            'Fellow monks and mommas, UNZA Library has increased WiFi bandwidth in basement reading halls ahead of semester finals. Power sockets have also been serviced.',
            'unza',
            'Great East Road',
            'exams',
            'LibraryMonk',
            0,
            42,
            1,
            1,
            'UNZA,Exams,Library,WiFi'
        ]);
        $pStmt->execute([
            'post-live-2',
            'CBU Riverside Engineering Workshop Exhibition Tomorrow',
            'All CBU engineering students are welcome to the Jambo Drive innovation hall tomorrow at 10:00 AM for the annual robotics and mining tech demo.',
            'cbu',
            'Riverside Kitwe',
            'events',
            'CopperGeek',
            1,
            35,
            0,
            0,
            'CBU,Engineering,Innovation'
        ]);

        $cStmt = $pdo->prepare("INSERT INTO comments (id, post_id, author_alias, author_university, content, upvotes) VALUES (?, ?, ?, ?, ?, ?)");
        $cStmt->execute([
            'c-1',
            'post-live-1',
            'RidgewayDoc',
            'unza',
            'Confirmed, downloading anatomy slides without lag today!',
            8
        ]);
    }

    // Seed initial campus poll
    $pollCount = (int)$pdo->query("SELECT COUNT(*) FROM polls")->fetchColumn();
    if ($pollCount === 0) {
        $plStmt = $pdo->prepare("INSERT INTO polls (id, question, university, total_votes, closing_date, category) VALUES (?, ?, ?, ?, ?, ?)");
        $plStmt->execute([
            'poll-server-1',
            'Which university library has the fastest WiFi for exam prep?',
            'all',
            413,
            '2026-12-01',
            'Academics'
        ]);

        $optStmt = $pdo->prepare("INSERT INTO poll_options (id, poll_id, text, votes) VALUES (?, ?, ?, ?)");
        $options = [
            ['opt-1', 'poll-server-1', 'UNZA Great East Road Library', 142],
            ['opt-2', 'poll-server-1', 'CBU Riverside Knowledge Centre', 118],
            ['opt-3', 'poll-server-1', 'ZCAS University Digital Lab', 89],
            ['opt-4', 'poll-server-1', 'Mulungushi Great North Resource Hall', 64],
        ];
        foreach ($options as $opt) {
            $optStmt->execute($opt);
        }
    }
}
