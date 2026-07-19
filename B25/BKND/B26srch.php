<?php
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");

// 1. 檢查參數是否存在
$filename = $_POST['filename'] ?? '';
if (empty($filename)) {
    echo json_encode([]);
    exit;
}

// 2. 解析字串
$parts = explode('|', $filename);
[
    $f01, 
    $f02, 
    $f90, 
    $initial_val
] = array_pad($parts, 4, ''); 

// 確保累計起點是數字
$running_total = is_numeric($initial_val) ? (float)$initial_val : 0;

// 3. 使用 Prepared Statements
$sql = "SELECT F90, F03, F06, F07, F04, F08 
        FROM b26 
        WHERE F01 = ? AND F02 = ? AND F90 = ? 
        ORDER BY F03, F07";

$stmt = mysqli_prepare($link, $sql);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "sss", $f01, $f02, $f90);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $arr = array();
    if ($result) {
        while ($list3 = mysqli_fetch_assoc($result)) {
            $current_qty = (float)$list3['F04']; // 轉為數字處理
            $running_total += $current_qty;
            
            $arr[] = [
                '異動日期_ISC_010'  => $list3['F90'] . '-' . $list3['F03'],
                '單據類別_ISC_012' => $list3['F06'],
                '單據編號_ISL_012' => $list3['F07'],
                '異動數量_ISR_014'   => $current_qty,
                '累計數量_ISR_014'   => $running_total,
                '備註說明_ISL_038'     => $list3['F08']
            ];
        }
    }
    mysqli_stmt_close($stmt);
}

// 4. 關閉連線與輸出
mysqli_close($link);

// 使用 JSON_UNESCAPED_UNICODE 讓中文正常顯示
// 使用 JSON_NUMERIC_CHECK 則會自動將數字字串轉為數字型態 (選用)
echo json_encode($arr, JSON_UNESCAPED_UNICODE);