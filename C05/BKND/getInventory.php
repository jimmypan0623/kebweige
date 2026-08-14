<?php
require_once("../../include/BKND/auth_check.php"); // 驗證
header("Content-Type: application/json; charset=utf-8"); // 改為 JSON 回傳格式

require_once("../../include/BKND/mysqli_server.php"); // 引用資料庫連線檔（假設變數名為 $link 或 $conn）

// 接收前端傳遞的參數
$account = $_POST['account'] ?? '';

// SQL 語句（必須是字串，並使用問號 ? 作為預處理占位符）
$sql = "SELECT COALESCE(SUM(b11.F04), 0) AS inventory
        FROM b11
        WHERE b11.F03 = ?
          AND b11.F01 IN (
              SELECT F01 
              FROM a14 
              WHERE F12 = 'Y'
          )";

// 使用 mysqli 預處理查詢（避免 SQL Injection）
if ($stmt = mysqli_prepare($link, $sql)) { // 若你的連線變數是 $conn，請將 $link 改為 $conn
    mysqli_stmt_bind_param($stmt, "s", $account);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode(['inventory' => (float)$row['inventory']]);
    } else {
        echo json_encode(['inventory' => 0]);
    }
    
    mysqli_stmt_close($stmt);
} else {
    // 預處理失敗時回傳 0
    echo json_encode(['inventory' => 0, 'error' => mysqli_error($link)]);
}

mysqli_close($link);
?>
 