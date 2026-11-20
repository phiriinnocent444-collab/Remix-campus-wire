-- =====================================================================
-- ZedWhisper Zambia - InfinityFree MySQL Schema (Optional phpMyAdmin Import)
-- Note: api/db.php automatically creates and seeds these tables on first
-- request, so manual import is only needed if you want to pre-inspect.
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS posts (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) NOT NULL,
    author_alias VARCHAR(120) NOT NULL,
    author_university VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS polls (
    id VARCHAR(64) PRIMARY KEY,
    question TEXT NOT NULL,
    university VARCHAR(64) NOT NULL,
    total_votes INT DEFAULT 0,
    closing_date VARCHAR(32) NOT NULL,
    category VARCHAR(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS poll_options (
    id VARCHAR(64) PRIMARY KEY,
    poll_id VARCHAR(64) NOT NULL,
    text VARCHAR(255) NOT NULL,
    votes INT DEFAULT 0,
    INDEX idx_poll_id (poll_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
