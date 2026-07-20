<?php
require_once("../../include/BKND/auth_check.php"); //驗證
 header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");

// 取得傳入參數 (預期格式為 "廠商編號|料號")
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$str = explode('|', $filename);

// 基本檢查：確保參數完整
if (count($str) < 2) {
    echo json_encode(array());
    exit;
}

$vendorNo = trim($str[0]); // d11.F05 (廠商編號)
$stockNo  = trim($str[1]); // d11.F03 (料號)

// 1. 建立 SQL 語句，使用 ? 佔位符
// 邏輯保持：依照年份(F90)與日期(F01)組合排序
$sql = "SELECT d11.F90, d11.F01, d11.F04, d11.F08 
        FROM d11 
        WHERE d11.F05 = ? AND d11.F03 = ? 
        ORDER BY CONCAT(d11.F90, d11.F01) DESC";

// 2. 執行預處理查詢
$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "ss", $vendorNo, $stockNo);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$arr = array();
while ($list3 = mysqli_fetch_assoc($result)) {
    // 輸出欄位與前端對應：ship_date 在進貨端通常指進貨日期
    $arr[] = array(
        '進貨日期_ISC_030' => $list3['F90'] . '-' . $list3['F01'],
        '進貨單號_ISC_030'   => $list3['F04'],
        '進貨數量_ISC_040'  => $list3['F08']
    );
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區並輸出 JSON
if (ob_get_length()) ob_clean();
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?>