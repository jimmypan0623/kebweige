<?php
header("Content-Type: application/json; charset=utf-8"); 

include("../../include/BKND/mysqli_server.php");           
require_once "../../include/BKND/fieldpreset.php"; 

// 1. 取得並驗證輸入
$filename = $_POST['filename'] ?? '';
$arr = array();
$pgeno = '';

// 2. 判斷查詢模式 (PGE 月次查詢 或 關鍵字過濾)
if (substr($filename, 0, 3) == "PGE") {
    $pgeno = getNeedBetween($filename, 'E', '|');
    $pgeno_safe = mysqli_real_escape_string($link, $pgeno);
    
    $sql3 = "SELECT b04.*, c01.F05 as F0E, c01.F04 AS F0D, c01.F10 AS F1Z, c01.F12 AS F1B, c01.F13, a01.F03 as F0C 
             FROM b04 
             LEFT OUTER JOIN c01 ON c01.F01 = b04.F06
             LEFT OUTER JOIN a01 ON a01.F01 = b04.F09 
             WHERE b04.F90 = '$pgeno_safe' 
             ORDER BY b04.F01 DESC";
} else {
    $fieldNo = substr($filename, 0, 7);
    $filterKey = getNeedBetween($filename, '|', '_');
    $pgeno = substr(strrchr($filename, '_'), 1);
    
    $fieldNo_safe = mysqli_real_escape_string($link, $fieldNo); // 欄位名安全處理
    $filterKey_safe = mysqli_real_escape_string($link, trim($filterKey));
    $pgeno_safe = mysqli_real_escape_string($link, $pgeno);

    $sql3 = "SELECT b04.*, c01.F05 as F0E, c01.F04 AS F0D, c01.F10 AS F1Z, c01.F12 AS F1B, c01.F13, a01.F03 as F0C 
             FROM b04 
             LEFT OUTER JOIN c01 ON c01.F01 = b04.F06
             LEFT OUTER JOIN a01 ON a01.F01 = b04.F09 
             WHERE b04.F90 = '$pgeno_safe' 
             AND b04.$fieldNo_safe LIKE '%$filterKey_safe%' 
             ORDER BY b04.$fieldNo_safe, b04.F02 DESC";
}

// 3. 查詢結轉狀態 (a23)
$sql0 = "SELECT F07 FROM a23 WHERE F01 = '" . mysqli_real_escape_string($link, $pgeno) . "'";
$res1 = mysqli_query($link, $sql0);
$list4 = mysqli_fetch_assoc($res1);

// 4. 取得欄位寬度預設值與執行主查詢
$wthary = fldwdthpre('B04', '1', $link); 
$result = mysqli_query($link, $sql3);

if ($result) {
    while ($list3 = mysqli_fetch_assoc($result)) {
        $arr[] = array(
            'rc_no' . ($wthary[0] ?? '')           => $list3['F00'],
            'query_no' . ($wthary[1] ?? '')        => $list3['F01'],
            'custom_no' . ($wthary[2] ?? '')       => $list3['F06'],
            'custom_name' . ($wthary[3] ?? '')     => $list3['F0E'], // 對應 F0E
            'custom_fullname' . ($wthary[4] ?? '') => $list3['F0D'], // 對應 F0D
            'unitedno' . ($wthary[5] ?? '')        => $list3['F1Z'],
            'contact' . ($wthary[6] ?? '')         => $list3['F1B'],
            'tel' . ($wthary[7] ?? '')             => $list3['F13'],
            'query_date' . ($wthary[8] ?? '')       => $list3['F02'],
            'sales_no' . ($wthary[9] ?? '')        => $list3['F09'],
            'sales_name' . ($wthary[10] ?? '')     => $list3['F0C'],
            'crncy_type' . ($wthary[11] ?? '')     => $list3['F14'],
            'crncy_rate' . ($wthary[12] ?? '')     => $list3['F16'],
            'invoice_no' . ($wthary[13] ?? '')     => $list3['F20'],
            'invoice_type' . ($wthary[14] ?? '')   => $list3['F22'],
            'tax_type' . ($wthary[15] ?? '')       => $list3['F23'],
            'payment' . ($wthary[16] ?? '')        => $list3['F21'],
            'ship_address' . ($wthary[17] ?? '')    => $list3['F12'], // 原代碼為 ship_address
            'ship_direct' . ($wthary[18] ?? '')     => $list3['F24'],
            'shure' . ($wthary[19] ?? '')          => $list3['F10'],
            'lastupdate' . ($wthary[20] ?? '')     => $list3['F11']
        );
    }
}

mysqli_close($link);

// 5. 輸出 JSON
echo json_encode(array(
    'recdrow' => $arr, 
    'pgttl'   => $list4['F07'] ?? ''
));

// 輔助函式
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>