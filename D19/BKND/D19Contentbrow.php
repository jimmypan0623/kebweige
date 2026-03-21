<?php
header("Content-Type: application/json; charset=utf-8"); // 標準化為 JSON 輸出
include("../../include/BKND/mysqli_server.php");

// 1. 取得小數點位數設定 (來自 Cookie)
$rnddgt = isset($_COOKIE["INT_068"]) ? intval($_COOKIE["INT_068"]) : 0;

// 2. 檢查並解析傳入參數
if (!isset($_POST['keyfield']) || empty($_POST['keyfield'])) {
    echo json_encode(array('recdrow' => [], 'error' => 'Missing keyfield'));
    exit;
}

$str = explode('|', $_POST['keyfield']);
$vendor_no = mysqli_real_escape_string($link, trim($str[0])); // 廠商代號
$pgeno     = mysqli_real_escape_string($link, $str[1] ?? ''); // 月次

// 3. 執行 SQL 查詢 (d19 為應付明細檔)
// 排序：日期(F01)、單號(F02)、料號(F05)
$sql = "SELECT * FROM `d19` 
        WHERE `F03` = '$vendor_no' AND `F90` = '$pgeno' 
        ORDER BY `F01`, `F02`, `F05` ";

$arr = array();
$result = mysqli_query($link, $sql);

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // 預轉型為浮點數確保計算準確
        $qty   = (float)$row['F06']; // 數量
        $price = (float)$row['F07']; // 單價
        $rate  = (float)$row['F14']; // 匯率
        
        $arr[] = array(
            'ship_date_DSL_008'     => $row['F01'],
            'invoice_no_DSL_009'    => $row['F17'],
            'stock_no_DSL_012'      => $row['F05'],
            'bill_no_DSL_009'       => $row['F02'],
            'ship_qty_DSR_007'      => $qty,
            'unit_price_DSR_007'    => $price,
            'crncy_type_DSC_004'    => $row['F13'],
            'crncy_rate_DSR_007'    => $rate,
            // 計算本幣總額並依據設定進位
            'rcd_total_DSR_008'     => round($qty * $price * $rate, $rnddgt),
            'sending_bill_DSL_009'  => $row['F04'],
            'vendor_partno_DSL_010' => $row['F08']
        );
    }
}

// 4. 關閉連線並回傳 JSON
mysqli_close($link);
echo json_encode(array('recdrow' => array_values($arr)));
?>

 