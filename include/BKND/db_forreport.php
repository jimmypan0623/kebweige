<?php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = 'To6035376615004513834';
$db_name = 'tkdata';

// 建立連線
$link = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$link) {
    die("報表資料庫連線失敗: " . mysqli_connect_error());
}

// 強制設定編碼
mysqli_query($link, 'set names utf8');

// (選填) 報表專用設定：如果資料量大，可以放寬記憶體或執行時間
// ini_set('memory_limit', '256M');
?>