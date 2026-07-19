<?php
header("Content-Type: application/json; charset=utf-8"); // 修正為 json 格式
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";
// --- 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式為 c01.Fxx 或 Fxx
    return preg_match('/^((c01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 解析傳入參數 (預期格式為 "F01|關鍵字")
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$fieldNo = substr($filename, 0, 7);
$filterKey = substr(strrchr($filename, '|'), 1);
$searchRecord = trim($filterKey);

// 1. 安全檢查：檢查欄位名是否合法
if (!isValidField($fieldNo)) {
    $fieldNo = "c01.F01"; // 若非法則強制設為預設欄位
}

// 補全資料表前綴防止 Ambiguous error
if (stripos($fieldNo, '.') === false) {
    $fieldNo = "c01." . $fieldNo;
}

// 2. 構建 SQL 語句
$columns = "c01.F01, c01.F05, c01.F07, c01.F39, c01.F32, c01.F33, c01.F04, 
            a01.F03 as F0C, c01.F12, c01.F31, c01.F15, c01.F36";

$sql = "SELECT $columns FROM c01 
        LEFT OUTER JOIN a01 ON c01.F33 = a01.F01";

// 判斷是否有搜尋關鍵字
if (strlen($searchRecord) > 0) {
    $sql .= " WHERE $fieldNo LIKE ? ";
}

$sql .= " ORDER BY $fieldNo";

// 3. 執行預處理查詢
$stmt = mysqli_prepare($link, $sql);

if (strlen($searchRecord) > 0) {
    $filterParam = "%$searchRecord%";
    mysqli_stmt_bind_param($stmt, "s", $filterParam);
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$wthary = fldwdthpre('C04', 'C', $link);
$afld=['F01','F05','F33','F0C','F39','F12','F31','F15','F36','F07','F32','F04'];
$arr=afldcont($result,$afld,$wthary);

mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區並輸出 JSON
if (ob_get_length()) ob_clean();
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?>