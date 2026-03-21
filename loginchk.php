<?php
// 1. 初始化環境
session_start();
//var_dump($_SESSION); exit;
header("Content-Type:text/html; charset=utf-8");
include("include/BKND/mysqli_server.php");

/**
 * 輔助函式：發生錯誤時重定向並記錄 Cookie
 */
function redirectWithError($errCode, $account, $password) {
    setcookie('CAPTCHA', '', time() - 3600, "/"); // 清除舊驗證碼標記
    setcookie('errmsg', $errCode, 0, "/");
    setcookie('tmpacnt', $account, 0, "/");
    setcookie('tmppswd', $password, 0, "/");
    header('Location: index.html');
    exit;
}

// 2. 檢查是否已經登入過 (避免重複登入)
if (isset($_COOKIE['userid']) && isset($_COOKIE['CAPTCHA'])) {
    redirectWithError('A3', '', ''); // A3 代表重複登入
}

// 3. 獲取 POST 數據
$user_account   = $_POST['account'] ?? '';
$user_password  = $_POST['password'] ?? '';
$user_validcode = $_POST['validcode'] ?? '';

// 4. 第一關：比對驗證碼 (從 Session 讀取正確答案)
$real_captcha = $_SESSION['captcha_code'] ?? '';

// 使用 strcasecmp 進行不分大小寫的比對
if (empty($user_validcode) || strcasecmp($user_validcode, $real_captcha) !== 0) {
    redirectWithError('A2', $user_account, $user_password); // A2 代表驗證碼錯誤
}

// 5. 第二關：資料庫查詢 (使用準備語句防止 SQL Injection)
$query = "SELECT F00, F01, F02, F03, F04 FROM a01 WHERE F01 = ? AND F02 = ? LIMIT 1";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "ss", $user_account, $user_password);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_row($result)) {
    // --- 登入成功 ---
    session_regenerate_id(true);
    // A. 設置身分識別 Cookie
    setcookie('userid', md5($row[0]), 0, "/");
    setcookie('useraccount', $row[1], 0, "/");
    
    // B. 清除暫存與錯誤資訊
    setcookie('tmpacnt', '', time() - 3600, "/");
    setcookie('tmppswd', '', time() - 3600, "/");
    setcookie('errmsg', '', time() - 3600, "/");

    // C. 載入系統參數 (a26 表)
    $sql_params = "SELECT F01, F06 FROM a26 WHERE F04 <> 'T' ORDER BY F01";
    $param_res  = mysqli_query($link, $sql_params);
    while ($param = mysqli_fetch_array($param_res)) {
        setcookie($param['F01'], $param['F06'], 0, "/");
    }

    // D. 紀錄伺服器 IP (加密後存入 Cookie)
    $server_ip = gethostbyname(gethostname() . ".");
    setcookie('svripmd5', md5($server_ip), 0, "/");

    // E. 驗證碼使用後失效 (增加安全性)
    unset($_SESSION['captcha_code']);

    // F. 跳轉至主畫面 (傳遞使用者姓名)
    $home_url = 'index.html?username=' . urlencode($row[3]);
    header('Location: ' . $home_url);
    
} else {
    // --- 帳密錯誤 ---
    redirectWithError('A1', $user_account, $user_password); // A1 代表帳密錯誤
}

// 關閉資料庫連線
mysqli_close($link);
?>