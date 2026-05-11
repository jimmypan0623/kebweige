<?php
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");

// 取得小數點位數設定 (應付帳款通常使用 INT_068)
$rnddgt = isset($_COOKIE["INT_068"]) ? intval($_COOKIE["INT_068"]) : 0;
$keyfield = $_POST['keyfield'] ?? '';

if (empty($keyfield)) {
    echo json_encode(['recdrow' => [], 'error' => 'Empty Key']);
    exit;
}

// 解析參數
$str = explode('|', $keyfield);
$vendor_no = trim($str[0]);
$pgeno     = $str[1] ?? '';

// 使用 Prepared Statement 確保安全並明確指定欄位
$sql = "SELECT F01, F17, F05, F02, F06, F07, F14, F13, F04, F08 
        FROM d19 
        WHERE F03 = ? AND F90 = ? 
        ORDER BY F01, F02, F05";

$stmt = $link->prepare($sql);
$stmt->bind_param("ss", $vendor_no, $pgeno);
$stmt->execute();
$result = $stmt->get_result();

$arr = [];
while ($row = $result->fetch_assoc()) {
    $qty   = (float)$row['F06'];
    $price = (float)$row['F07'];
    $rate  = (float)$row['F14'];
    
    $arr[] = [
        'ship_date_DSL_008'     => $row['F01'],
        'invoice_no_DSL_009'    => $row['F17'],
        'stock_no_DSL_012'      => $row['F05'],
        'bill_no_DSL_009'       => $row['F02'],
        'ship_qty_DSR_007'      => $qty,
        'unit_price_DSR_007'    => $price,
        'crncy_type_DSC_004'    => $row['F13'],
        'crncy_rate_DSR_007'    => $rate,
        // 計算總額：數量 * 單價 * 匯率
        'rcd_total_DSR_008'     => round($qty * $price * $rate, $rnddgt),
        'sending_bill_DSL_009'  => $row['F04'],
        'vendor_partno_DSL_010' => $row['F08']
    ];
}

$stmt->close();
$link->close();

// 直接輸出，不使用 ob_end_clean() 除非有非預期的輸出干擾
echo json_encode(['recdrow' => array_values($arr)]);