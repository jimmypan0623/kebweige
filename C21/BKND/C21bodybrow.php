<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php"); 
require_once "../../include/BKND/fieldpreset.php";

// --- 輔助函式：白名單檢查欄位名 (防止 SQL 注入欄位位元) ---
function isValidField($field) {
    // 限制只能是 c27.Fxx, b01.Fxx 或 Fxx
    return preg_match('/^((c27|b01)\.)?F[0-9]{2}$/i', $field);
}

// 取得傳入參數
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$str = explode('|', $filename);

// 基本檢查：確保至少有主鍵值 (c27.F01)
if (count($str) < 1 || empty($str[0])) {
    echo json_encode(array('recdrow' => array(), 'pgttl' => 0));
    exit;
}

// 變數初始化與預設值處理
$parentKey = $str[0];                                   // 關聯鍵 (c27.F01)
$searchField = isset($str[1]) ? trim($str[1]) : 'F02';  // 搜尋欄位，預設為料號
$searchValue = isset($str[2]) ? trim($str[2]) : '';     // 搜尋值
$filterKey = "%$searchValue%";

// 安全檢查：若欄位名不在白名單內，強制設為預設值
if (!isValidField($searchField)) {
    $searchField = "c27.F02";
}

// 補全資料表前綴防止 ambiguous error
if (stripos($searchField, '.') === false) {
    $searchField = "c27." . $searchField;
}

// 建立 SQL 語句 (使用 Prepared Statement)
$sql = "SELECT c27.*, b01.F02 AS F0B 
        FROM c27 
        LEFT OUTER JOIN b01 ON c27.F02 = b01.F01 
        WHERE c27.F01 = ? AND $searchField LIKE ? 
        ORDER BY c27.F02 ASC";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "ss", $parentKey, $filterKey);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 取得欄位寬度設定 (C21 類型 2 代表表身)
$wthary = fldwdthpre('C21', '2', $link);
$arr = array();

while ($list3 = mysqli_fetch_assoc($result)) {
    // 映射對應欄位
    $atr = array(
        'rc_no' . ($wthary[0] ?? '')          => $list3['F00'],
        'stockno' . ($wthary[1] ?? '')        => $list3['F02'],
        'stockname' . ($wthary[2] ?? '')      => $list3['F0B'],
        'query_qty' . ($wthary[3] ?? '')      => $list3['F03'],
        'query_price' . ($wthary[4] ?? '')    => $list3['F04'],
        'custom_partno' . ($wthary[5] ?? '')  => $list3['F05'],
        'basic_pack' . ($wthary[6] ?? '')     => $list3['F06'],
        'min_order' . ($wthary[7] ?? '')      => $list3['F07'],
        'datestart' . ($wthary[8] ?? '')      => $list3['F15'],
        'dateline' . ($wthary[9] ?? '')       => $list3['F17'],
        'lastupdate' . ($wthary[10] ?? '')    => $list3['F99']
    );
    $arr[] = $atr;
}

// 取得總筆數
$rows_count = count($arr);

mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區防止非預期輸出
if (ob_get_length()) ob_clean();

// 輸出 JSON
echo json_encode(array(
    'recdrow' => $arr, 
    'pgttl' => $rows_count
), JSON_UNESCAPED_UNICODE);
?>