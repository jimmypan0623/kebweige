<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 取得並驗證輸入
$filename = $_POST['filename'] ?? '';
$str = explode('|', $filename);

if (count($str) < 3) {
    echo json_encode(['recdrow' => [], 'pgttl' => 0, 'error' => 'Invalid parameters']);
    exit;
}

// 2. 欄位安全驗證函式
function isValidField($field) {
    // 嚴格限制格式：c01.Fxx 或 c02.Fxx 或 Fxx (xx 為數字)
    return preg_match('/^((c01|c02)\.)?F[0-9]{2}$/i', $field);
}

$searchColumn = $str[1];
if (!isValidField($searchColumn)) {
    // 如果欄位格式不對，強制設為預設欄位或報錯
    $searchColumn = "c02.F01"; 
}

// 3. 使用預處理語句 (Prepared Statements) 防止注入
// 注意：欄位名稱 ($searchColumn) 不能當作參數，所以必須用上面的白名單過濾
$searchTerm = "%" . trim($str[2]) . "%";

$sql = "SELECT c02.*, c01.F05 as F0E 
FROM c02 
LEFT JOIN c01 ON c02.F01 = c01.F44 
WHERE c02.F03 = ?
AND BINARY $searchColumn LIKE ?
ORDER BY c02.F01";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "ss", $str[0], $searchTerm);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 4. 取得寬度並處理資料
$wthary = fldwdthpre('B01', '2', $link);
$afld=['F00','F01','F0E','F04','F06','F07','F13','F08','F10','F11','F02','F15','F16','F99'];
$arr=afldcont($result,$afld,$wthary);


mysqli_close($link);

// 5. 回傳 JSON
echo json_encode(array('recdrow' => $arr, 'pgttl' => 12));
?>