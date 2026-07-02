<?php
header('Content-Type: application/json; charset=utf-8');
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
require_once("../../include/BKND/mysqli_server.php"); // 引入設定檔
require_once "../../include/BKND/fieldpreset.php";
$rows = 0;
$arr = array();

// --- 輔助函式：白名單檢查欄位名 (比照 B01) ---
function isValidField($field) {
    // 限制欄位格式，允許 c03, c01, a01 的前綴
    return preg_match('/^((c03|c01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 統一的欄位與 JOIN 選取
$columns = "c03.F00, c03.F01, c03.F02, c03.F03, c03.F04, c03.F06, c03.F07, c03.F08, c03.F10, c03.F12, c03.F14, c03.F13,
            c01.F05 as F0E, c01.F04 AS F0D, a01.F03 as F0C,c00.F04 AS F0H";

$joins = "FROM c03 
          LEFT OUTER JOIN c01 ON c01.F01 = c03.F03
          LEFT OUTER JOIN a01 ON a01.F01 = c03.F07 
          LEFT OUTER JOIN c00 ON c00.F01 = c03.F12";
// 判斷模式
if (substr($_POST['filename'], 0, 3) == "PGE") {
    
    // 1. 分頁模式處理
    $pgeno = (int)getNeedBetween($_POST['filename'], 'E', '|');
    $rows = (int)getNeedBetween($_POST['filename'], '|', '_');
    $pagerows = (int)substr(strrchr($_POST['filename'], '_'), 1);
    
    // 計算總筆數 (初次載入時)
    if ($rows <= 0) {        
        $resK = mysqli_query($link, "SELECT COUNT(*) as total FROM `c03` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;

    $sql = "SELECT $columns $joins ORDER BY c03.F01 DESC LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {    
    // 2. 搜尋模式 (比照 B01 explode 邏輯)
    $parts = explode('|', $_POST['filename']);
    $fieldNo = $parts[0];
    $filterValue = trim($parts[1] ?? '');
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 確保 $fieldNo 有 c03 前綴以防止 Ambiguous error
    if (stripos($fieldNo, '.') === false) {
        $fieldNo = "c03." . $fieldNo;
    }

    $sql = "SELECT $columns $joins WHERE BINARY $fieldNo LIKE ? ORDER BY $fieldNo, c03.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
    
    // 搜尋模式下通常回傳前 100 筆或根據需求調整，這裡設定不限制但建議前端處理
    // 如果需要搜尋模式也分頁，則需要額外處理 $rows
    $rows = 100; // 預設給一個搜尋顯示上限
}

// 執行並獲取結果
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
// 獲取欄位寬度設定
$wthary = fldwdthpre('C04', '1', $link);
 
$afld=['F00','F01','F03','F0E','F0D','F02','F07','F0C','F12','F0H','F14','F06','F13','F08','F04','F10'];
$arr=afldcont($result,$afld,$wthary);

mysqli_stmt_close($stmt);
mysqli_close($link);

$json_output = array('recdrow' => $arr, 'pgttl' => (int)$rows);

// 清除緩衝區防止多餘輸出
if (ob_get_length()) ob_clean(); 

echo json_encode($json_output, JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>