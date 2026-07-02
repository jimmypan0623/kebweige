<?php
ob_start();
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$rows = 0;
$arr = array();

// --- 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式為 d01.Fxx，防止非法 SQL 指令
    return preg_match('/^((d01|a01|d00)\.)?F[0-9]{2}$/i', $field);
}

// 統一的欄位選取 (對應 d01 供應商主檔)
$columns = "d01.F00, d01.F01, d01.F03, d01.F04, d01.F12, d01.F06, d01.F11, d01.F19, d01.F05, d01.F21, d01.F08,
            d01.F07, d01.F09, d01.F10, d01.F22, d01.F25, d00.F04 AS F0D, d01.F15, d01.F38, d01.F13, d01.F36, d01.F39, 
            a01.F03 as F03A, d01.F16, d01.F14, d01.F18";

$joins = "FROM `d01` 
          LEFT OUTER JOIN `a01` ON d01.F39 = a01.F01 
          LEFT OUTER JOIN `d00` ON d00.F01 = d01.F25";

// 判斷分頁模式 (PGE) 或 搜尋模式
if (substr($_POST['filename'], 0, 3) == "PGE") {
    // 1. 分頁模式
    $pgeno = (int)getNeedBetween($_POST['filename'], 'E', '|');
    $rows = (int)getNeedBetween($_POST['filename'], '|', '_');
    $pagerows = (int)substr(strrchr($_POST['filename'], '_'), 1);
    
    // 初次載入算總筆數
    if ($rows <= 0) {
        $resK = mysqli_query($link, "SELECT COUNT(F01) as total FROM `d01` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;
    $sql = "SELECT $columns $joins ORDER BY d01.F01 LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {
    // 2. 搜尋模式
    $fieldNo = substr($_POST['filename'], 0, 7);
    $filterValue = trim(substr(strrchr($_POST['filename'], '|'), 1));
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 確保欄位有名稱前綴
    if (stripos($fieldNo, '.') === false) { $fieldNo = "d01." . $fieldNo; }

    $sql = "SELECT $columns $joins WHERE $fieldNo LIKE ? ORDER BY $fieldNo, d01.F01";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
}

// 執行查詢
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 獲取欄位配置 (Table: D01)
$wthary = fldwdthpre('D01', '1', $link);
$afld=['F00','F01','F03','F04','F12','F06','F11','F19','F05','F21','F08','F07','F09','F10','F22','F25','F0D','F15','F38','F13',
      'F36','F39','F03A','F16','F14','F18'];
$arr=afldcont($result,$afld,$wthary);


mysqli_stmt_close($stmt);
mysqli_close($link);
 ob_end_clean(); 
echo json_encode(array('recdrow' => $arr, 'pgttl' => (int)$rows), JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>