<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
include("../../include/BKND/mysqli_server.php");
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
$arr = array();

while ($list3 = mysqli_fetch_assoc($result)) {
    $arr[] = array(
        'rc_no' . ($wthary[0] ?? '')          => $list3['F00'],
        'customno_' . ($wthary[1] ?? '')      => $list3['F01'],
        'customname' . ($wthary[2] ?? '')     => $list3['F0E'],
        'custom_partno' . ($wthary[3] ?? '')  => $list3['F04'],
        'crncy_type' . ($wthary[4] ?? '')     => $list3['F06'],
        'query_price' . ($wthary[5] ?? '')    => $list3['F07'],
        'basic_pack' . ($wthary[6] ?? '')     => $list3['F13'],
        'min_order' . ($wthary[7] ?? '')      => $list3['F08'],
        'payment' . ($wthary[8] ?? '')        => $list3['F10'],
        'query_no' . ($wthary[9] ?? '')       => $list3['F11'],
        'datestart' . ($wthary[10] ?? '')     => $list3['F02'],
        'dateline' . ($wthary[11] ?? '')      => $list3['F15'],
        'remark' . ($wthary[12] ?? '')        => $list3['F16'],
        'lastupdate' . ($wthary[13] ?? '')    => $list3['F99']
    );
}

mysqli_close($link);

// 5. 回傳 JSON
echo json_encode(array('recdrow' => $arr, 'pgttl' => 12));
?>