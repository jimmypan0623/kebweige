<?php
header("Content-Type: application/json; charset=utf-8"); // 改為 JSON 格式標頭
require_once("../../include/BKND/mysqli_server.php");

// 1. 安全地處理參數
$rndnb = isset($_COOKIE['INT_001']) ? (int)$_COOKIE['INT_001'] : 0;
$searchRecord = isset($_POST['filename']) ? $_POST['filename'] : '';

// 2. 使用預處理語句 (防止 SQL 注入)
$sql = "SELECT b11.F01, a14.F02, a14.F12, b11.F03, b11.F04, b11.F05, b11.F06, 
               DATEDIFF(CURDATE(), b11.F05) as diffdate 
        FROM b11 
        LEFT OUTER JOIN a14 ON a14.F01 = b11.F01 
        WHERE b11.F04 != 0 AND b11.F03 = ? 
        ORDER BY b11.F01 DESC";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "s", $searchRecord); // "s" 代表字串
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$arr = array();
if ($result) {
    while ($list3 = mysqli_fetch_assoc($result)) {
        $arr[] = array(
            'dpt_no'      => $list3['F01'],
            'dpt_name'    => $list3['F02'],
            'avail'       => $list3['F12'],
            'stock_qty'   => round((float)$list3['F04'], $rndnb), // 確保為浮點數後再四捨五入
            'last_update' => $list3['F05'],
            'apply'       => $list3['F06'],
            'diffdate'    => $list3['diffdate']
        );
    }
}

// 3. 關閉連線並輸出
mysqli_close($link);
echo json_encode($arr);
?>