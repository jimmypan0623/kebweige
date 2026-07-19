<?php 
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";
// 取得傳入參數 (預期格式為 "F05值|F03值")
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$str = explode('|', $filename);

// 基本檢查：確保至少有兩個必要的過濾參數
if (count($str) < 2) {
    echo json_encode(array());
    exit;
}

$paramF05 = trim($str[0]); // 可能是 客戶編號 或 關聯鍵
$paramF03 = trim($str[1]); // 可能是 料號 或 訂單號

// 1. 建立 SQL 語句使用 ? 佔位符
// 這裡使用了 CONCAT(F90, F01) 進行排序，與你原本邏輯一致  c10.F90, c10.F01,
$sql = "SELECT CONCAT(c10.F90,'-', c10.F01) AS F0A, c10.F04, c10.F08 
        FROM c10 
        WHERE c10.F05 = ? AND c10.F03 = ? 
        ORDER BY CONCAT(c10.F90, c10.F01) DESC";

// 2. 執行預處理查詢
$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "ss", $paramF05, $paramF03);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$wthary = fldwdthpre('C04', 'B', $link);

$afld=['F0A','F04','F08'];
$arr=afldcont($result,$afld,$wthary);
mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區並輸出 JSON
if (ob_get_length()) ob_clean();
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?>