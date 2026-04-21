<?php
ob_start();
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");

// 取得小數點位數，預設為 0
$rnddgt = isset($_COOKIE["INT_069"]) ? intval($_COOKIE["INT_069"]) : 0;

if (!isset($_POST['keyfield'])) {
    echo json_encode(['recdrow' => [], 'error' => 'No keyfield provided']);
    exit;
}

$str = explode('|', $_POST['keyfield']);
$f03_val = mysqli_real_escape_string($link, trim($str[0]));
$f90_val = mysqli_real_escape_string($link, $str[1]);

// 查詢銷貨紀錄
$sql3 = "SELECT * FROM `c13` 
         WHERE `F03` = '$f03_val' AND `F90` = '$f90_val' 
         ORDER BY `F01`, `F02`, `F05` ";

$arr = array();
$result = mysqli_query($link, $sql3);

if ($result) {
    while ($list3 = mysqli_fetch_assoc($result)) {
        // 預先轉型確保運算準確
        $qty = (float)$list3['F06'];
        $price = (float)$list3['F07'];
        $rate = (float)$list3['F14'];
        
        $arr[] = array(
            'ship_date_DSL_008'    => $list3['F01'],
            'invoice_no_DSL_009'   => $list3['F17'],
            'stock_no_DSL_012'     => $list3['F05'],
            'bill_no_DSL_009'      => $list3['F02'],
            'ship_qty_DSR_007'     => $qty,
            'unit_price_DSR_007'   => $price,
            'crncy_type_DSC_004'   => $list3['F13'],
            'crncy_rate_DSR_007'   => $rate,
            // 計算總額並套用 Cookie 的小數位數設定
            'rcd_total_DSR_008'    => round($qty * $price * $rate, $rnddgt),
            'customer_po_DSL_009'  => $list3['F04'],
            'customer_partno_DSL_011' => $list3['F08']
        );
    }
}

mysqli_close($link);
ob_end_clean(); 
echo json_encode(array('recdrow' => $arr));
?>
 