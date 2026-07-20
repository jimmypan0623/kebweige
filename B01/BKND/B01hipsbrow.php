<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 檢查參數是否存在
if (!isset($_POST['filename'])) {
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

// 2. 解析參數
$str = explode('|', $_POST['filename']);
$f03_val    = $str[0] ?? '';
$search_col = $str[1] ?? '';
$search_val = trim($str[2] ?? '');

// 3. 安全驗證函式
function isValidField($field) {
    // 嚴格限制格式：d01.Fxx 或 d02.Fxx 或 Fxx (xx 為數字)
    return preg_match('/^((d01|d02)\.)?F[0-9]{2}$/i', $field);
}

// 4. 執行欄位安全檢查 (這是最關鍵的一步！)
if (!isValidField($search_col)) {
    echo json_encode(['error' => 'Invalid field detected', 'field' => $search_col]);
    exit;
}

// 取得欄位寬度
$wthary = fldwdthpre('B01', '3', $link);

// 5. 準備 SQL (欄位已通過正規化驗證，其餘參數使用綁定)
$sql = "SELECT d02.*, d01.F04 AS F0D 
        FROM d02 
        LEFT OUTER JOIN d01 ON d02.F01 = d01.F01 
        WHERE d02.F03 = ? AND $search_col LIKE ? 
        ORDER BY d02.F01";

$stmt = mysqli_prepare($link, $sql);
$like_val = "%$search_val%";
mysqli_stmt_bind_param($stmt, "ss", $f03_val, $like_val);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$afld=['F00','F01','F0D','F04','F06','F07','F13','F08','F10','F11','F02','F15','F16','F99'];
$arr=afldcont($result,$afld,$wthary);

mysqli_close($link);

// 6. 輸出結果
echo json_encode([
    'recdrow' => $arr,
    'pgttl'   => 12
], JSON_UNESCAPED_UNICODE);
?>