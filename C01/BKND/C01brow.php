<?php
ob_start();
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$rows = 0;
$arr = array();

// 讀取小數位數參數，預設為 0，限制在 0-6 之間
$rndnb = isset($_COOKIE['INT_001']) ? (int)$_COOKIE['INT_001'] : 0;
$rndnb = max(0, min($rndnb, 6));

// --- 輔助函式：白名單檢查欄位名，防止 SQL 注入 ---
function isValidField($field) {
    // 限制欄位格式為 c01.Fxx 或相關關聯表的 Fxx
    return preg_match('/^((c01|a01|c00|a0A|a0B)\.)?F[0-9]{2}$/i', $field);
}

// 1. 統一的欄位選取 (對應 c01 客戶主檔)
$columns = "c01.F00, c01.F01, c01.F03, c01.F04, c01.F05, c01.F06, c01.F07, c01.F08, c01.F09,
            c01.F10, c01.F11, c01.F12, c01.F13, c01.F14, c01.F15, c01.F16, c01.F17, c01.F19, 
            c01.F20, c01.F21, c01.F22, c01.F23, a0B.F03 as F03B, c01.F25, c01.F26, c01.F29, 
            c01.F30, c01.F31, c01.F32, c01.F33, a0A.F03 as F03A, c01.F36, c01.F38, c01.F39, 
            c00.F04 AS F0D, c01.F40, c01.F41, c01.F42, c01.F43, c01.F44";

$joins = "FROM `c01` 
          LEFT OUTER JOIN `a01` AS a0A ON c01.F33 = a0A.F01 
          LEFT OUTER JOIN `a01` AS a0B ON c01.F23 = a0B.F01 
          LEFT OUTER JOIN `c00` ON c00.F01 = c01.F39";

// 2. 判斷模式：分頁 (PGE) 或 搜尋
if (substr($_POST['filename'], 0, 3) == "PGE") {
    // --- 分頁模式 ---
    $pgeno = (int)getNeedBetween($_POST['filename'], 'E', '|');
    $rows = (int)getNeedBetween($_POST['filename'], '|', '_');
    $pagerows = (int)substr(strrchr($_POST['filename'], '_'), 1);
    
    // 如果是初始載入，計算總筆數
    if ($rows <= 0) {
        $resK = mysqli_query($link, "SELECT COUNT(F01) as total FROM `c01` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;
    $sql = "SELECT $columns $joins ORDER BY c01.F01 LIMIT ?, ?";
    
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {
    // --- 搜尋模式 ---
    $parts = explode('|', $_POST['filename']);
    $fieldNo = $parts[0];
    $filterValue = trim($parts[1] ?? '');
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field access')));
    }

    // 確保欄位有名稱前綴
    if (stripos($fieldNo, '.') === false) { $fieldNo = "c01." . $fieldNo; }

    $sql = "SELECT $columns $joins WHERE $fieldNo LIKE ? ORDER BY $fieldNo";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
}

// 3. 執行查詢
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 獲取欄位寬度配置 (Table ID: C01)
$wthary = fldwdthpre('C01', '1', $link);

// 4. 資料封裝
$afld=['F00','F01','F04','F05','F03','F10','F43','F21','F20','F41','F42','F29','F30','F09','F06','F07','F08','F32','F12','F11',
       'F13','F14','F22','F44','F39','F0D','F17','F38','F15','F36','F33','F03A','F23','F03B','F31','F40','F25','F16','F19','F26'];
$arr=afldcont($result,$afld,$wthary);
// 5. 關閉資源並輸出
mysqli_stmt_close($stmt);
mysqli_close($link);

if (ob_get_length()) ob_clean(); // 清除可能的潛在輸出緩衝
echo json_encode(array('recdrow' => $arr, 'pgttl' => (int)$rows), JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>