<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$pollId = isset($_GET['id']) ? $_GET['id'] : '';

function fetchFormattedPoll(PDO $pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM polls WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }

    $optStmt = $pdo->prepare("SELECT id, text, votes FROM poll_options WHERE poll_id = ?");
    $optStmt->execute([$row['id']]);
    $options = [];
    foreach ($optStmt->fetchAll() as $opt) {
        $options[] = [
            'id' => $opt['id'],
            'text' => $opt['text'],
            'votes' => intval($opt['votes'])
        ];
    }

    return [
        'id' => $row['id'],
        'question' => $row['question'],
        'university' => $row['university'],
        'options' => $options,
        'totalVotes' => intval($row['total_votes']),
        'closingDate' => $row['closing_date'],
        'category' => $row['category']
    ];
}

// 1. GET /api/polls -> list all polls
if ($method === 'GET' && empty($action)) {
    $stmt = $pdo->query("SELECT id FROM polls ORDER BY closing_date ASC");
    $pollRows = $stmt->fetchAll();
    $polls = [];
    foreach ($pollRows as $r) {
        $formatted = fetchFormattedPoll($pdo, $r['id']);
        if ($formatted) {
            $polls[] = $formatted;
        }
    }

    echo json_encode([
        'polls' => $polls
    ]);
    exit();
}

// 2. POST /api/polls/:id/vote -> cast a vote
if ($method === 'POST' && $action === 'vote' && !empty($pollId)) {
    $body = json_decode(file_get_contents('php://input'), true);
    $optionId = isset($body['optionId']) ? trim($body['optionId']) : '';

    if (empty($optionId)) {
        http_response_code(400);
        echo json_encode(['error' => 'optionId is required.']);
        exit();
    }

    $checkPoll = $pdo->prepare("SELECT id FROM polls WHERE id = ?");
    $checkPoll->execute([$pollId]);
    if (!$checkPoll->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Poll not found.']);
        exit();
    }

    $checkOpt = $pdo->prepare("SELECT id FROM poll_options WHERE id = ? AND poll_id = ?");
    $checkOpt->execute([$optionId, $pollId]);
    if (!$checkOpt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Poll option not found.']);
        exit();
    }

    $updOpt = $pdo->prepare("UPDATE poll_options SET votes = votes + 1 WHERE id = ? AND poll_id = ?");
    $updOpt->execute([$optionId, $pollId]);

    $updPoll = $pdo->prepare("UPDATE polls SET total_votes = total_votes + 1 WHERE id = ?");
    $updPoll->execute([$pollId]);

    $poll = fetchFormattedPoll($pdo, $pollId);
    echo json_encode([
        'success' => true,
        'poll' => $poll
    ]);
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Invalid polls endpoint.']);
