<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header('Content-Type: application/json; charset=utf-8');
require_once("../../include/BKND/mysqli_server.php");

// 檢查 POST 參數是否存在
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';

$arr = array();

// 1. 使用 Prepared Statement 防止 SQL 注入
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    $sql = "SELECT `F02`, `F00` FROM `a01` WHERE F00='".$_SESSION['user_id']."' AND binary `F01` = ?";
}else{
    $sql = "SELECT `F02`, `F00` FROM `a01` WHERE  binary `F01` = ?";
}
$stmt = mysqli_prepare($link, $sql);

if ($stmt) {
    // 綁定參數 (s 代表 string)
    mysqli_stmt_bind_param($stmt, "s", $filename);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $arr[] = array(
                'passWord' => $row['F02'],
                'userId'   => $row['F00']
            );
        }
    } else {
        // 查無資料時回傳空值結構
        $arr[] = array('passWord' => "", 'userId' => "");
    }
    
    mysqli_stmt_close($stmt);
} else {
    // 處理 SQL 語法錯誤
    $arr[] = array('error' => 'Query failed');
}

mysqli_close($link);

// 輸出 JSON
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?> 