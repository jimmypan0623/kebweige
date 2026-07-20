<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$arr = array();
$pgeno_val = ""; // 儲存月次批號 (F90)

// --- 1. 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式為 b02.Fxx, d01.Fxx 或 a01.Fxx
    return preg_match('/^((b02|d01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 統一的欄位選取與 JOIN 設定 (對應 B02 邏輯)
$columns = "b02.F00, b02.F01, b02.F02, b02.F06, b02.F10, b02.F09, b02.F11, b02.F12, b02.F14, b02.F16, b02.F20, b02.F21, b02.F22, b02.F23, b02.F24,
            b02.F90,d01.F04 as F0D, d01.F03 AS F0C, d01.F06 AS F1Z, d01.F08 AS F1B, d01.F09 AS F0I, a01.F03 as F0G,d00.F04 AS F0H";

$joins = "FROM b02 
          LEFT OUTER JOIN d01 ON d01.F01 = b02.F06
          LEFT OUTER JOIN a01 ON a01.F01 = b02.F09 
          LEFT OUTER JOIN d00 ON d00.F01 = b02.F14";
// 2. 判斷模式
$filename = $_POST['filename'] ?? '';

if (substr($filename, 0, 3) == "PGE") {
    // --- 月次模式 ---
    $pgeno_val = getNeedBetween($filename, 'E', '|');
    
    $sql = "SELECT $columns $joins WHERE b02.F90 = ? ORDER BY b02.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $pgeno_val);

} else if (strpos($filename, '|') !== false) {
    // --- 搜尋模式 (欄位|關鍵字_批號) ---
    $parts = explode('|', $filename);
    $fieldNo = trim($parts[0]);
    
    // 解析關鍵字與月次批號
    $filterValue = trim(getNeedBetween($filename, '|', '_'));
    $filterKey = "%$filterValue%";
    $pgeno_val = substr(strrchr($filename, '_'), 1);

    // 安全檢查
    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 確保欄位有正確的主表前綴
    if (stripos($fieldNo, '.') === false) {
        $fieldNo = "b02." . $fieldNo;
    }

    $sql = "SELECT $columns $joins WHERE b02.F90 = ? AND $fieldNo LIKE ? ORDER BY $fieldNo, b02.F02 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $pgeno_val, $filterKey);
} else {
    die(json_encode(array('error' => 'Format error', 'received' => $filename)));
}

// 3. 執行查詢
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 4. 查詢結轉狀態 (a23)
$sqlStatus = "SELECT F07 FROM a23 WHERE F01 = ?";
$stmtStatus = mysqli_prepare($link, $sqlStatus);
mysqli_stmt_bind_param($stmtStatus, "s", $pgeno_val);
mysqli_stmt_execute($stmtStatus);
$resStatus = mysqli_stmt_get_result($stmtStatus);
$list4 = mysqli_fetch_assoc($resStatus);
$pgttl = $list4['F07'] ?? '';

// 5. 取得欄位寬度並整理資料 (Table B02)
$wthary = fldwdthpre('B02', '1', $link);
$afld=['F00','F01','F06','F0D','F0C','F1Z','F1B','F0I','F02','F09','F0G','F14','F0H','F16','F20','F22','F23',
       'F21','F12','F24','F90','F10','F11'];
$arr=afldcont($result,$afld,$wthary);

mysqli_stmt_close($stmt);
mysqli_stmt_close($stmtStatus);
mysqli_close($link);

// 6. 輸出結果
echo json_encode(array('recdrow' => array_values($arr), 'pgttl' => $pgttl), JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>