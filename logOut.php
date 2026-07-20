<?php
// 1. 立即啟動 Session 並清理
session_start();
session_unset();
session_destroy();

header('Content-type:text/html; charset=utf-8');
require_once("include/BKND/mysqli_server.php");

// 2. 定義 Cookie 過期時間
$past = time() - 999;

// 3. 清除 Session Cookie (PHPSESSID)
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', $past, '/');
}

// 4. 定義需要清除的固定 Cookie 清單
$cookiesToClear = ['useraccount', 'CAPTCHA', 'tmpacnt', 'tmppswd', 'errmsg'];

foreach ($cookiesToClear as $cookieName) {
    setcookie($cookieName, '', $past, '/');
}

// 6. 關閉資料庫連線
mysqli_close($link);

// 7. 重新定向回首頁
header('Location: index.html');
exit;
?>