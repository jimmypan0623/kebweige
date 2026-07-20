<?php
  require_once("../../include/BKND/auth_check.php"); //驗證 
  	header("Content-Type: text/html; charset=utf-8");   

require_once("../../include/BKND/mysqli_server.php"); // 引用檔

// 1. 安全過濾輸入值
$searchRecord = isset($_POST['filename']) ? mysqli_real_escape_string($link, $_POST['filename']) : '';

if ($searchRecord !== '') {
    // 2. 執行查詢
    $sql3 = "SELECT `F02` FROM `c00` WHERE `F01` = '$searchRecord' LIMIT 1";
    $sql4 = mysqli_query($link, $sql3); 
    
    if ($sql4 && $list1 = mysqli_fetch_assoc($sql4)) {
        // 3. 輸出結果
        echo $list1['F02'];
    } else {
        // 找不到資料時的處理
        echo "找不到資料"; 
    }
}

mysqli_close($link);           
?>  

 