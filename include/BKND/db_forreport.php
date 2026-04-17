<?php
// db_config.php

// 定義連線參數
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'To6035376615004513834');
define('DB_NAME', 'tkdata');

// 建立連線並設定編碼
function get_db_connection() {
    $link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    
    if (!$link) {
        die("連線失敗: " . mysqli_connect_error());
    }
    
    mysqli_query($link, 'set names utf8');
    return $link;
}
?>