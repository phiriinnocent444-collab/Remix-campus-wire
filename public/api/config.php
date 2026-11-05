<?php
/**
 * InfinityFree Database & Environment Configuration
 * ----------------------------------------------------
 * You can find these credentials inside your InfinityFree
 * Control Panel (VistaPanel) under "MySQL Databases".
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. InfinityFree MySQL Details
define('DB_HOST', getenv('INFINITYFREE_DB_HOST') ?: 'sql102.epizy.com');
define('DB_NAME', getenv('INFINITYFREE_DB_NAME') ?: 'epiz_34567890_zedwhisper');
define('DB_USER', getenv('INFINITYFREE_DB_USER') ?: 'epiz_34567890');
define('DB_PASS', getenv('INFINITYFREE_DB_PASS') ?: 'YourVPanelPasswordHere');
define('DB_PORT', getenv('INFINITYFREE_DB_PORT') ?: '3306');

// 2. Secret Key for JWT / Student Session Verification
define('JWT_SECRET', 'zedwhisper_zambia_secure_secret_key_2026');
