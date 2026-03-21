<?php
// 1. 立即啟動 Session 並清理
session_start();
session_unset();
session_destroy();

header('Content-type:text/html; charset=utf-8');
include("include/BKND/mysqli_server.php");

// 2. 定義 Cookie 過期時間
$past = time() - 3600;

// 3. 清除 Session Cookie (PHPSESSID)
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', $past, '/');
}

// 4. 定義需要清除的固定 Cookie 清單
$cookiesToClear = ['userid', 'useraccount', 'CAPTCHA', 'svripmd5', 'stdmnu', 'tmpacnt', 'tmppswd', 'errmsg'];

foreach ($cookiesToClear as $cookieName) {
  setcookie($cookieName, '', $past, '/');
	// setcookie($cookieName,'', time()-999);			 
}

// 5. 動態清除 a26 表定義的系統參數
$sql3 = "SELECT F01 FROM a26"; 
$sql4 = mysqli_query($link, $sql3);

if ($sql4) {
    while ($list3 = mysqli_fetch_array($sql4)) {
        //setcookie($list3['F01'], '', $past, '/');
		 setcookie($list3['F01'],'', time()-999);			 
    }
}

// 6. 關閉資料庫連線
mysqli_close($link);

// 7. 重新定向回首頁
header('Location: index.html');
exit;
?>