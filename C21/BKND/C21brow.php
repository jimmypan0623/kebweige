<?php
header('Content-Type: application/json; charset=utf-8');
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php"); 
require_once "../../include/BKND/fieldpreset.php";

// --- 1. 初始化與參數處理 ---
$filename = $_POST['filename'] ?? '';
$arr = [];
$total_rows = 0;

// --- 2. 輔助函式：安全性檢查 ---
function isValidField($field) {
    // 允許 c26, c01, a01 的前綴與 Fxx 格式
    return preg_match('/^((c26|c01|a01)\.)?F[0-9]{2}$/i', $field);
}

function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}

// --- 3. 定義統一的 SQL 結構 ---
$columns = "c26.F00, c26.F01, c26.F02, c26.F03, c26.F05, c26.F06, c26.F07, c26.F09, c26.F14, c26.F11, c26.F10, c26.F15,
            c01.F04 as F0D, c01.F05 as F0E, a01.F03 as F0C, c26.F04,c00.F04 AS F0H";

$joins = "FROM c26 
          LEFT OUTER JOIN c01 ON c01.F01 = c26.F03
          LEFT OUTER JOIN a01 ON a01.F01 = c26.F06
		  LEFT JOIN c00 ON c00.F01 = c26.F14";

// --- 4. 判斷模式 (分頁 vs 搜尋) ---
if (substr($filename, 0, 3) == "PGE") {
    // --- 分頁模式 ---
    $pgeno = (int)getNeedBetween($filename, 'E', '|');
    $total_rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);
    
    // 如果是初始畫面，重新計算總筆數
    if ($total_rows <= 0) {
        $resK = mysqli_query($link, "SELECT COUNT(*) as total FROM `c26` ");
        $rowK = mysqli_fetch_assoc($resK);
        $total_rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;
    $sql = "SELECT $columns $joins ORDER BY c26.F01 DESC LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {
    // --- 搜尋模式 ---
    $parts = explode('|', $filename);
    $fieldNo = $parts[0];
    $filterValue = trim($parts[1] ?? '');
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 補足表別前綴防止 Ambiguous error
    if (stripos($fieldNo, '.') === false) {
        $fieldNo = "c26." . $fieldNo;
    }

    $sql = "SELECT $columns $joins WHERE BINARY $fieldNo LIKE ? ORDER BY $fieldNo ASC, c26.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
    
    // 搜尋模式暫不分頁，可根據需求調整 $total_rows
    $total_rows = 100; 
}

// --- 5. 執行查詢並映射資料 ---
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 獲取欄位寬度設定 (對應 C21)
$wthary = fldwdthpre('C21', '1', $link);
$afld=['F00','F01','F03','F0E','F0D','F02','F06','F0C','F14','F0H','F07','F09','F10','F11','F15','F04','F05'];
$arr=afldcont($result,$afld,$wthary);

// --- 6. 釋放資源與輸出 ---
mysqli_stmt_close($stmt);
mysqli_close($link);

// 確保無多餘輸出干擾 JSON
if (ob_get_length()) ob_clean();

echo json_encode([
    'recdrow' => $arr,
    'pgttl'   => $total_rows
], JSON_UNESCAPED_UNICODE);
?>