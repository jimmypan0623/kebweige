<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// --- 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制只能是 c04.Fxx 或 Fxx   
	return preg_match('/^((c04|b01)\.)?F[0-9]{2}$/i', $field);
}

// 取得傳入參數
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$str = explode('|', $filename);

// 基本檢查：確保至少有主鍵值
if (count($str) < 1 || empty($str[0])) {
    echo json_encode(array('recdrow' => array(), 'pgttl' => 0));
    exit;
}

// 變數初始化
$parentKey = $str[0];                   // 主檔關聯鍵 (c04.F01)
$searchField = isset($str[1]) ? trim($str[1]) : 'F02'; // 搜尋欄位，預設為料號
$searchValue = isset($str[2]) ? trim($str[2]) : '';    // 搜尋值
$filterKey = "%$searchValue%";

// 安全檢查：欄位名白名單
if (!isValidField($searchField)) {
    $searchField = "F02"; // 非法欄位時強制設回預設值
}

// 補全資料表前綴防止 ambiguous error
if (stripos($searchField, '.') === false) {
    $searchField = "c04." . $searchField;
}

// 建立 SQL 語句
// c04.* (表身明細), b01.F02 (品名規格)
$sql = "SELECT c04.*, b01.F02 AS F0B 
        FROM c04 
        LEFT OUTER JOIN b01 ON c04.F02 = b01.F01 
        WHERE c04.F01 = ? AND $searchField LIKE ? 
        ORDER BY c04.F02 ASC";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "ss", $parentKey, $filterKey);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 取得欄位寬度設定 (C04 類型 2 代表表身)
$wthary = fldwdthpre('C04', '2', $link);
$arr = array();

while ($list3 = mysqli_fetch_assoc($result)) {
    $atr = array(
        'rc_no' . $wthary[0]         => $list3['F00'],
        'stockno' . $wthary[1]       => $list3['F02'],
        'stockname' . $wthary[2]     => $list3['F0B'],
        'query_qty' . $wthary[3]     => $list3['F03'],
        'query_price' . $wthary[4]   => $list3['F04'],
        'custom_partno' . $wthary[5] => $list3['F05'],
        'hopedate' . $wthary[6]      => $list3['F06'],
        'already' . $wthary[7]       => $list3['F09'], // 已出數量
        'beencancel' . $wthary[8]    => $list3['F21'], // 取消數量
        'notout' . $wthary[9]        => $list3['F23'], // 開單未出
        'lastupdate' . $wthary[10]   => $list3['F12']
    );
    $arr[] = $atr;
}

// 統計總筆數
$rows_count = count($arr);

mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區並輸出 JSON
if (ob_get_length()) ob_clean();
echo json_encode(array('recdrow' => $arr, 'pgttl' => $rows_count), JSON_UNESCAPED_UNICODE);
?>