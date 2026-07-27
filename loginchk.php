<?php
// 1. 初始化環境  
session_start();
header("Content-Type:text/html; charset=utf-8");

require_once("include/BKND/mysqli_server.php");

/**
 * 輔助函式：發生錯誤時重定向並記錄安全 Cookie
 */

function redirectWithError($errCode, $account, $password) {
    // 1. 徹底清空 Session 狀態，防止下一次請求被誤判為 A3
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    
    // 2. 重新開啟一個乾淨的 Session 供下一次驗證碼使用
    session_start();
    
    // 3. 設定錯誤與暫存資訊 (❌ 移除 httponly，否則前端 JS 無法讀取與刪除)
    setcookie('errmsg', $errCode, [
        'expires' => 0,
        'path' => '/',
        'secure' => false,
        'httponly' => false, // 必須為 false
        'samesite' => 'Strict'
    ]);
    setcookie('tmpacnt', $account, [
        'expires' => 0,
        'path' => '/',
        'secure' => false,
        'httponly' => false, // 必須為 false
        'samesite' => 'Strict'
    ]);
	
	// 如果傳入的密碼是空的，直接讓該 Cookie 過期（清除它）
    if (empty($password)) {
        setcookie('tmppswd', '', time() - 3600, "/");
    } else {
        setcookie('tmppswd', $password, [
            'expires' => 0,
            'path' => '/',
            'secure' => false,
            'httponly' => false,
            'samesite' => 'Strict'
        ]);
    }
    

    // 4. 強制瀏覽器不要快取這個重導向
    header("Cache-Control: no-cache, must-revalidate");
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
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

// 5. 第二關：資料庫查詢 (使用準備語句)  //F02,
$query = "SELECT F00, F01,F03, F04 FROM a01 WHERE F01 = ? AND F02 = ? LIMIT 1";
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
    $_SESSION['user_name']    = $row[2]; // F03

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
    $home_url = 'index.html?username=' . urlencode($row[2]);	 
    header('Location: ' . $home_url);    
} else {
    // --- 帳密錯誤 ---
    redirectWithError('A1', $user_account, ''); // A1 代表帳密錯誤
}

// 關閉資料庫連線
mysqli_stmt_close($stmt);
mysqli_close($link);
?>