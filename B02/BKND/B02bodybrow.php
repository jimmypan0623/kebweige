<?php
header("Content-Type: application/json; charset=utf-8"); 

include("../../include/BKND/mysqli_server.php");           
require_once "../../include/BKND/fieldpreset.php"; 

// 1. 取得並驗證輸入
$filename = $_POST['filename'] ?? '';
$str = explode('|', $filename);

if (count($str) < 3) {
    echo json_encode(['recdrow' => [], 'pgttl' => 0, 'error' => 'Invalid parameters']);
    exit;
}

// 2. 處理搜尋欄位與歧義問題 (Ambiguous Column Protection)
$rawField = trim($str[1]);

// 檢查欄位是否已經帶有表名，沒有則強制補上主表名 b0b. 以防與關聯表欄位衝突
if (strpos($rawField, '.') !== false) {
    $search_field = $rawField; 
} else {
    $search_field = "b0b." . $rawField;
}

// 3. 建立 SQL (使用 mysqli_real_escape_string 加強安全性)
$f01_safe = mysqli_real_escape_string($link, $str[0]);
$keyword_safe = mysqli_real_escape_string($link, trim($str[2]));

$sql3 = "SELECT b0b.*, b01.F02 AS F0B, a14.F02 AS F0C 
         FROM `b0b` 
         LEFT OUTER JOIN b01 ON b0b.F03 = b01.F01 
         LEFT OUTER JOIN a14 ON b0b.F05 = a14.F01 
         WHERE b0b.F01 = '$f01_safe' 
         AND $search_field LIKE '%$keyword_safe%' 
         ORDER BY b0b.F03"; 

// 4. 執行查詢與欄位設定
$wthary = fldwdthpre('B02', '2', $link);                 
$arr = array();    
$result = mysqli_query($link, $sql3); 

if ($result) {
    while ($list3 = mysqli_fetch_assoc($result)) {
        // 使用 ?? '' 防止 $wthary 索引不存在時報錯，並對應原有的 JSON Key
        $arr[] = array(
            'rc_no' . ($wthary[0] ?? '') => $list3['F00'],                   
            'stockno' . ($wthary[1] ?? '') => $list3['F03'], 
            'stocknam' . ($wthary[2] ?? '') => $list3['F0B'],
            'order_no' . ($wthary[3] ?? '') => $list3['F07'], 
            'query_qty' . ($wthary[4] ?? '') => $list3['F04'],                      
            'query_price' . ($wthary[5] ?? '') => $list3['F15'],                        
            'dept_no' . ($wthary[6] ?? '') => $list3['F05'],
            'dept_name' . ($wthary[7] ?? '') => $list3['F0C'],
            'vendor_partno' . ($wthary[8] ?? '') => $list3['F08'],  
            'vendor_po' . ($wthary[9] ?? '') => $list3['F09'],  
            'remark' . ($wthary[10] ?? '') => $list3['F25'],
            'lastupdate' . ($wthary[11] ?? '') => $list3['F11']
        );                         
    }
}

mysqli_close($link);

// 5. 輸出結果
echo json_encode(array('recdrow' => $arr, 'pgttl' => 12));
?>