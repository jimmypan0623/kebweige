<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 處理輸入參數
// 格式預期為: d02.F01 (供應商編號) | 搜尋欄位 | 搜尋關鍵字
$str = explode('|', $_POST['filename']);
$vender_no = $str[0] ?? '';
$search_field = $str[1] ?? '';
$search_key = "%" . trim($str[2] ?? '') . "%";

$arr = array();

// --- 安全性檢查：欄位白名單 ---
function isValidD02Field($field) {
    // 限制只能查詢 d02 表格的 Fxx 欄位，避免 SQL 注入
   return preg_match('/^((d02|b01)\.)?F[0-9]{2}$/i', $field);
}

// 2. 建立 SQL 指令
// 關聯 b01 取得品名 (F02)
$sql = "SELECT d02.F00, d02.F01, d02.F02, d02.F03, d02.F04, d02.F06, d02.F07, 
               d02.F08, d02.F11, d02.F13, d02.F15, d02.F16, d02.F99, 
               b01.F02 AS F0B 
        FROM `d02` 
        LEFT OUTER JOIN `b01` ON d02.F03 = b01.F01 
        WHERE d02.F01 = ? ";

// 動態加入搜尋過濾條件
if (isValidD02Field($search_field)) {
    $sql .= " AND $search_field LIKE ? ";
} else {
    $search_key = null; 
}

$sql .= " ORDER BY d02.F03";

// 3. 預處理語句執行 (防止 SQL Injection)
$stmt = mysqli_prepare($link, $sql);

if ($search_key !== null) {
    mysqli_stmt_bind_param($stmt, "ss", $vender_no, $search_key);
} else {
    mysqli_stmt_bind_param($stmt, "s", $vender_no);
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 4. 取得欄位寬度與前端標籤配置 (Table ID: D01, Page: 2)
$wthary = fldwdthpre('D01', '2', $link);

// 5. 資料封裝成 JSON 陣列
while ($list3 = mysqli_fetch_assoc($result)) {
    $atr = array(
        'rc_no' . $wthary[0]         => $list3['F00'],
        'stockno' . $wthary[1]       => $list3['F03'],
        'stockname' . $wthary[2]     => $list3['F0B'],
        'vendor_partno' . $wthary[3] => $list3['F04'],
        'crncy_type' . $wthary[4]    => $list3['F06'],
        'query_price' . $wthary[5]   => $list3['F07'],
        'basic_pack' . $wthary[6]    => $list3['F13'],
        'min_order' . $wthary[7]     => $list3['F08'],
        'leadtime' . $wthary[8]      => $list3['F11'],
        'datestart' . $wthary[9]     => $list3['F02'],
        'dateline' . $wthary[10]     => $list3['F15'],
        'remark' . $wthary[11]       => $list3['F16'],
        'lastupdate' . $wthary[12]   => $list3['F99']
    );
    $arr[] = $atr;
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 6. 輸出
if (ob_get_length()) ob_clean(); 
echo json_encode(array('recdrow' => $arr, 'pgttl' => count($arr)), JSON_UNESCAPED_UNICODE);
?>