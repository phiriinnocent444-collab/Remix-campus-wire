<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$postId = isset($_GET['id']) ? $_GET['id'] : '';

// 1. GET /api/posts.php -> list posts
if ($method === 'GET' && empty($action)) {
    $uni = isset($_GET['university']) ? $_GET['university'] : 'all';
    $cat = isset($_GET['category']) ? $_GET['category'] : 'all';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $sortBy = isset($_GET['sortBy']) ? $_GET['sortBy'] : 'trending';

    $sql = "SELECT * FROM posts WHERE 1=1";
    $params = [];

    if ($uni !== 'all' && !empty($uni)) {
        $sql .= " AND university = ?";
        $params[] = $uni;
    }

    if ($cat !== 'all' && !empty($cat)) {
        $sql .= " AND category = ?";
        $params[] = $cat;
    }

    if (!empty($search)) {
        $sql .= " AND (title LIKE ? OR content LIKE ? OR author_alias LIKE ?)";
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    if ($sortBy === 'latest') {
        $sql .= " ORDER BY created_at DESC";
    } elseif ($sortBy === 'discussed') {
        $sql .= " ORDER BY comments_count DESC";
    } else {
        $sql .= " ORDER BY (upvotes - downvotes) DESC";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rawPosts = $stmt->fetchAll();

    // Map fields
    $posts = [];
    foreach ($rawPosts as $row) {
        // Fetch comments for this post
        $cStmt = $pdo->prepare("SELECT id, post_id as postId, author_alias as authorAlias, author_university as authorUniversity, content, upvotes, created_at as timestamp FROM comments WHERE post_id = ? ORDER BY created_at ASC");
        $cStmt->execute([$row['id']]);
        $comments = $cStmt->fetchAll();

        $posts[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'university' => $row['university'],
            'campusBranch' => $row['campus_branch'] ?: 'Main Campus',
            'category' => $row['category'],
            'authorAlias' => $row['author_alias'],
            'isAnonymous' => (bool)$row['is_anonymous'],
            'upvotes' => (int)$row['upvotes'],
            'downvotes' => (int)$row['downvotes'],
            'commentsCount' => count($comments),
            'timestamp' => $row['created_at'],
            'tags' => array_filter(explode(',', $row['tags'])),
            'comments' => $comments
        ];
    }

    echo json_encode([
        'source' => 'InfinityFree MySQL',
        'count' => count($posts),
        'posts' => $posts
    ]);
    exit();
}

// 2. POST /api/posts.php -> create post
if ($method === 'POST' && empty($action)) {
    $body = json_decode(file_get_contents('php://input'), true);
    $title = isset($body['title']) ? trim($body['title']) : '';
    $content = isset($body['content']) ? trim($body['content']) : '';
    $university = isset($body['university']) ? trim($body['university']) : 'unza';
    $category = isset($body['category']) ? trim($body['category']) : 'gossip';
    $authorAlias = isset($body['authorAlias']) ? trim($body['authorAlias']) : 'ZedScholar';
    $isAnonymous = isset($body['isAnonymous']) ? (int)$body['isAnonymous'] : 1;
    $campusBranch = isset($body['campusBranch']) ? trim($body['campusBranch']) : 'Main Campus';
    $tags = isset($body['tags']) && is_array($body['tags']) ? implode(',', $body['tags']) : 'Campus';

    if (empty($title) || empty($content)) {
        http_response_code(400);
        echo json_encode(['error' => 'Title and content are required.']);
        exit();
    }

    $id = 'post-' . time() . '-' . rand(100, 999);

    $stmt = $pdo->prepare("INSERT INTO posts (id, title, content, university, campus_branch, category, author_alias, is_anonymous, upvotes, downvotes, comments_count, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, ?)");
    $stmt->execute([
        $id,
        $title,
        $content,
        $university,
        $campusBranch,
        $category,
        $authorAlias,
        $isAnonymous,
        $tags
    ]);

    http_response_code(201);
    echo json_encode([
        'message' => 'Post saved to InfinityFree MySQL.',
        'post' => [
            'id' => $id,
            'title' => $title,
            'content' => $content,
            'university' => $university,
            'campusBranch' => $campusBranch,
            'category' => $category,
            'authorAlias' => $authorAlias,
            'isAnonymous' => (bool)$isAnonymous,
            'upvotes' => 1,
            'downvotes' => 0,
            'commentsCount' => 0,
            'timestamp' => 'Just now',
            'tags' => explode(',', $tags),
            'comments' => []
        ]
    ]);
    exit();
}

// 3. POST /api/posts.php?action=vote&id=XYZ
if ($method === 'POST' && $action === 'vote' && !empty($postId)) {
    $body = json_decode(file_get_contents('php://input'), true);
    $direction = isset($body['direction']) ? $body['direction'] : 'up';

    if ($direction === 'down') {
        $stmt = $pdo->prepare("UPDATE posts SET downvotes = downvotes + 1 WHERE id = ?");
    } else {
        $stmt = $pdo->prepare("UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?");
    }
    $stmt->execute([$postId]);

    $fetch = $pdo->prepare("SELECT upvotes, downvotes FROM posts WHERE id = ?");
    $fetch->execute([$postId]);
    $res = $fetch->fetch();

    echo json_encode([
        'success' => true,
        'upvotes' => (int)($res ? $res['upvotes'] : 0),
        'downvotes' => (int)($res ? $res['downvotes'] : 0)
    ]);
    exit();
}

// 4. POST /api/posts.php?action=comment&id=XYZ
if ($method === 'POST' && $action === 'comment' && !empty($postId)) {
    $body = json_decode(file_get_contents('php://input'), true);
    $content = isset($body['content']) ? trim($body['content']) : '';
    $authorAlias = isset($body['authorAlias']) ? trim($body['authorAlias']) : 'Peer';
    $authorUniversity = isset($body['authorUniversity']) ? trim($body['authorUniversity']) : 'unza';

    if (empty($content)) {
        http_response_code(400);
        echo json_encode(['error' => 'Comment text cannot be empty.']);
        exit();
    }

    $cId = 'c-' . time() . '-' . rand(100, 999);
    $stmt = $pdo->prepare("INSERT INTO comments (id, post_id, author_alias, author_university, content, upvotes) VALUES (?, ?, ?, ?, ?, 0)");
    $stmt->execute([$cId, $postId, $authorAlias, $authorUniversity, $content]);

    $upd = $pdo->prepare("UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?");
    $upd->execute([$postId]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'comment' => [
            'id' => $cId,
            'postId' => $postId,
            'authorAlias' => $authorAlias,
            'authorUniversity' => $authorUniversity,
            'content' => $content,
            'upvotes' => 0,
            'timestamp' => 'Just now'
        ]
    ]);
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Invalid posts endpoint.']);
