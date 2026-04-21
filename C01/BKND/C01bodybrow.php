<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 處理傳入參數
// 預期格式: c02.F01 (客戶編號) | 搜尋欄位 | 搜尋關鍵字
$str = explode('|', $_POST['filename']);
$customer_no = $str[0] ?? '';
$search_field = $str[1] ?? '';
$search_key = "%" . trim($str[2] ?? '') . "%";

$arr = array();

// --- 安全性檢查：欄位白名單 ---
function isValidC02Field($field) {
    // 限制只能查詢 c02 表格的 Fxx 欄位   
	return preg_match('/^((c02|b01)\.)?F[0-9]{2}$/i', $field);
}

// 2. 建立 SQL 指令
// 關聯 b01 取得品名 (F02)
$sql = "SELECT c02.F00, c02.F01, c02.F02, c02.F03, c02.F04, c02.F06, c02.F07, 
               c02.F08, c02.F11, c02.F13, c02.F15, c02.F16, c02.F99, 
               b01.F02 AS F0B 
        FROM `c02` 
        LEFT OUTER JOIN `b01` ON c02.F03 = b01.F01 
        WHERE c02.F01 = ? ";

// 動態加入搜尋條件
if (isValidC02Field($search_field)) {
    $sql .= " AND $search_field LIKE ? ";
} else {
    // 若欄位非法，則僅執行基本客戶編號查詢
    $search_key = null; 
}

$sql .= " ORDER BY c02.F03";

// 3. 預處理與執行
$stmt = mysqli_prepare($link, $sql);

if ($search_key !== null) {
    mysqli_stmt_bind_param($stmt, "ss", $customer_no, $search_key);
} else {
    mysqli_stmt_bind_param($stmt, "s", $customer_no);
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 4. 取得欄位寬度配置 (Table ID: C01, Page: 2)
$wthary = fldwdthpre('C01', '2', $link);

// 5. 資料封裝
while ($list3 = mysqli_fetch_assoc($result)) {
    $atr = array(
        'rc_no' . $wthary[0]        => $list3['F00'],
        'stockno' . $wthary[1]      => $list3['F03'],
        'stockname' . $wthary[2]    => $list3['F0B'],
        'custom_partno' . $wthary[3] => $list3['F04'],
        'crncy_type' . $wthary[4]   => $list3['F06'],
        'query_price' . $wthary[5]  => $list3['F07'],
        'basic_pack' . $wthary[6]   => $list3['F13'],
        'min_order' . $wthary[7]    => $list3['F08'],
        'query_no' . $wthary[8]     => $list3['F11'],
        'datestart' . $wthary[9]    => $list3['F02'],
        'dateline' . $wthary[10]    => $list3['F15'],
        'remark' . $wthary[11]      => $list3['F16'],
        'lastupdate' . $wthary[12]  => $list3['F99']
    );
    $arr[] = $atr;
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 6. 輸出 JSON (pgttl 建議改為實際筆數，或依據分頁逻辑計算)
echo json_encode(array('recdrow' => $arr, 'pgttl' => count($arr)), JSON_UNESCAPED_UNICODE);
?>