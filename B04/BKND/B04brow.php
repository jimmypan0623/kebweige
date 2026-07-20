<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$arr = array();
$pgeno_val = ""; // 用於儲存月次批號 (F90)

// --- 1. 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 允許 b04.Fxx 或 c01.Fxx 或 a01.Fxx 格式
    return preg_match('/^((b04|c01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 統一的欄位選取與 JOIN 設定
$columns = "b04.F00, b04.F01, b04.F02, b04.F06, b04.F10, b04.F09, b04.F11, b04.F12, b04.F14, b04.F16, b04.F20, b04.F21, b04.F22, b04.F23, b04.F24,
            b04.F90,c01.F05 as F0E, c01.F04 AS F0D, c01.F10 AS F1Z, c01.F12 AS F1B, c01.F13, a01.F03 as F0C,c00.F04 AS F0H";

$joins = "FROM b04 
          LEFT JOIN c01 ON c01.F01 = b04.F06
          LEFT JOIN a01 ON a01.F01 = b04.F09
		  LEFT JOIN c00 ON c00.F01 = b04.F14";

// 2. 判斷模式
if (substr($_POST['filename'], 0, 3) == "PGE") {
    // --- 月次模式 (分頁或初次載入) ---
    $pgeno_val = getNeedBetween($_POST['filename'], 'E', '|');
    
    // B04 慣例：依據批號 F90 查詢
    $sql = "SELECT $columns $joins WHERE b04.F90 = ? ORDER BY b04.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $pgeno_val);

} else {
    // --- 搜尋模式 (欄位|關鍵字_批號) ---
    $parts = explode('|', $_POST['filename']);
    $fieldNo = $parts[0]; // 欄位名
    $remaining = $parts[1] ?? ''; 
    
    // 解析關鍵字與月次批號 (例如：F01|ABC_202401)
    $filterValue = trim(getNeedBetween($_POST['filename'], '|', '_'));
    $filterKey = "%$filterValue%";
    $pgeno_val = substr(strrchr($_POST['filename'], '_'), 1);

    // 安全檢查：若欄位名不合法則報錯
    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 補上前綴以防歧義
    if (stripos($fieldNo, '.') === false) {
        $fieldNo = "b04." . $fieldNo;
    }

    $sql = "SELECT $columns $joins WHERE b04.F90 = ? AND $fieldNo LIKE ? ORDER BY $fieldNo, b04.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $pgeno_val, $filterKey);
}

// 3. 執行查詢
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 4. 查詢月結狀態 (a23)
$sql0 = "SELECT F07 FROM a23 WHERE F01 = ?";
$stmt0 = mysqli_prepare($link, $sql0);
mysqli_stmt_bind_param($stmt0, "s", $pgeno_val);
mysqli_stmt_execute($stmt0);
$res0 = mysqli_stmt_get_result($stmt0);
$list4 = mysqli_fetch_assoc($res0);
$pgttl = $list4['F07'] ?? '';

// 5. 取得欄位寬度並整理資料
$wthary = fldwdthpre('B04', '1', $link);
$afld=['F00','F01','F06','F0E','F0D','F1Z','F1B','F13','F02','F09','F0C','F14','F0H','F16','F20','F22',
'F23','F21','F12','F24','F90','F10','F11'];
$arr=afldcont($result,$afld,$wthary);

mysqli_stmt_close($stmt);
mysqli_stmt_close($stmt0);
mysqli_close($link);

// 6. 輸出結果
echo json_encode(array('recdrow' => $arr, 'pgttl' => $pgttl), JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return "";
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>