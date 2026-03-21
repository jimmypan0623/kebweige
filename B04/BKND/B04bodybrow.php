<?php
header("Content-Type: application/json; charset=utf-8"); // 建議改為 application/json

include("../../include/BKND/mysqli_server.php");           
require_once "../../include/BKND/fieldpreset.php"; 

// 1. 取得並驗證輸入
$filename = $_POST['filename'] ?? '';
$str = explode('|', $filename);

if (count($str) < 3) {
    echo json_encode(['recdrow' => [], 'pgttl' => 0, 'error' => 'Invalid parameters']);
    exit;
}

// 2. 處理搜尋欄位與歧義問題
$rawField = trim($str[1]);

// 檢查欄位是否已經帶有表名 (例如 b0d.F03)
if (strpos($rawField, '.') !== false) {
    // 已有表名，直接使用（但仍建議透過 mysqli_real_escape_string 保護）
    $search_field = $rawField; 
} else {
    // 沒有表名，強制補上主表名 b0d. 以防 ambiguous 錯誤
    $search_field = "b0d." . $rawField;
}

// 3. 建立 SQL
$f01_safe = mysqli_real_escape_string($link, $str[0]);
$keyword_safe = mysqli_real_escape_string($link, trim($str[2]));

$sql3 = "SELECT b0d.*, b01.F02 AS F0B, a14.F02 AS F0C 
         FROM `b0d` 
         LEFT OUTER JOIN b01 ON b0d.F03 = b01.F01 
         LEFT OUTER JOIN a14 ON b0d.F05 = a14.F01 
         WHERE b0d.F01 = '$f01_safe' 
         AND $search_field LIKE '%$keyword_safe%' 
         ORDER BY b0d.F03"; 

// 4. 執行查詢
$wthary = fldwdthpre('B04', '2', $link);                 
$arr = array();    
$result = mysqli_query($link, $sql3); 

if ($result) {
    while ($list3 = mysqli_fetch_assoc($result)) {
        // 使用 ?? '' 防止 $wthary 索引不存在時報錯
        $arr[] = array(
            'rc_no' . ($wthary[0] ?? '') => $list3['F00'],                   
            'stockno' . ($wthary[1] ?? '') => $list3['F03'], 
            'stockname' . ($wthary[2] ?? '') => $list3['F0B'],
            'order_no' . ($wthary[3] ?? '') => $list3['F07'], 
            'query_qty' . ($wthary[4] ?? '') => $list3['F04'],                      
            'query_price' . ($wthary[5] ?? '') => $list3['F15'],                        
            'dept_no' . ($wthary[6] ?? '') => $list3['F05'],
            'dept_name' . ($wthary[7] ?? '') => $list3['F0C'],
            'custom_partno' . ($wthary[8] ?? '') => $list3['F08'],  
            'custom_po' . ($wthary[9] ?? '') => $list3['F09'],  
            'remark' . ($wthary[10] ?? '') => $list3['F25'],
            'lastupdate' . ($wthary[11] ?? '') => $list3['F11']
        );                         
    }
} else {
    // 供除錯使用，正式上線可隱藏
    // echo json_encode(['error' => mysqli_error($link)]); exit;
}

mysqli_close($link);

// 5. 輸出結果
echo json_encode(array('recdrow' => $arr, 'pgttl' => 12));
?>