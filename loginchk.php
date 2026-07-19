<?php
// 1. 初始化環境
session_start();
header("Content-Type:text/html; charset=utf-8");
require_once("include/BKND/mysqli_server.php");

/**
 * 輔助函式：發生錯誤時重定向並記錄安全 Cookie
 */
function redirectWithError($errCode, $account, $password) {
    // 清除舊驗證碼標記 (不限於 Cookie，Session 也一同清理)
    unset($_SESSION['captcha_code']);
    
    // 設定錯誤與暫存資訊，啟用 HttpOnly 以增強安全性
    setcookie('errmsg', $errCode, [
        'expires' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    setcookie('tmpacnt', $account, [
        'expires' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    setcookie('tmppswd', $password, [
        'expires' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    header('Location: index.html');
    exit;
}

// 2. 檢查是否已經登入過 (修正原本檢查錯 Cookie 名稱的盲點，改以 Session 為核心判斷)
if (isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true) {
    redirectWithError('A3', '', ''); // A3 代表重複登入
}

// 3. 獲取 POST 數據
$user_account   = $_POST['account'] ?? '';
$user_password  = $_POST['password'] ?? '';
$user_validcode = $_POST['validcode'] ?? '';

// 4. 第一關：比對驗證碼
$real_captcha = $_SESSION['captcha_code'] ?? '';

if (empty($user_validcode) || strcasecmp($user_validcode, $real_captcha) !== 0) {
    redirectWithError('A2', $user_account, ''); // A2 代表驗證碼錯誤
}

// 5. 第二關：資料庫查詢 (使用準備語句)
$query = "SELECT F00, F01, F02, F03, F04 FROM a01 WHERE F01 = ? AND F02 = ? LIMIT 1";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "ss", $user_account, $user_password);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_row($result)) {
    // --- 登入成功 ---
    // 防範安全漏洞：重新生成 Session ID 防止固定攻擊 (Session Fixation)
    session_regenerate_id(true);
    
    // 【核心修正】將登入狀態寫入伺服器端 Session，杜絕前端瀏覽器直接偽造 Cookie 的權限漏洞
    $_SESSION['is_logged_in'] = true;
    $_SESSION['user_id']      = $row[0]; // F00
    $_SESSION['user_account'] = $row[1]; // F01
    $_SESSION['user_name']    = $row[3]; // F03

    // 依然保留前端 UI 需要的 useraccount Cookie，但只做顯示與基本閉包比對用
    setcookie('useraccount', $row[1], [
        'expires' => 0,
        'path' => '/',
        'samesite' => 'Strict'
    ]);
    
    // B. 清除暫存與錯誤資訊 Cookie (設定過期時間為過去)
    setcookie('tmpacnt', '', time() - 3600, "/");
    setcookie('tmppswd', '', time() - 3600, "/");
    setcookie('errmsg', '', time() - 3600, "/");

    // E. 驗證碼使用後失效
    unset($_SESSION['captcha_code']);

    // F. 跳轉至主畫面 (傳遞使用者姓名)
    $home_url = 'index.html?username=' . urlencode($row[3]);
    header('Location: ' . $home_url);
    
} else {
    // --- 帳密錯誤 ---
    redirectWithError('A1', $user_account, ''); // A1 代表帳密錯誤
}

// 關閉資料庫連線
mysqli_stmt_close($stmt);
mysqli_close($link);
?>