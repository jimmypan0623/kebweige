<?php
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");

$rnddgt = isset($_COOKIE["INT_069"]) ? intval($_COOKIE["INT_069"]) : 0;
$keyfield = $_POST['keyfield'] ?? '';

if (empty($keyfield)) {
    echo json_encode(['recdrow' => [], 'error' => 'No keyfield']);
    exit;
}

$str = explode('|', $keyfield);
$f03_val = trim($str[0]);
$f90_val = $str[1] ?? '';

// 使用 Prepared Statement 防止 SQL 注入
$sql = "SELECT F01, F17, F05, F02, F06, F07, F14, F13, F04, F08 
        FROM c13 
        WHERE F03 = ? AND F90 = ? 
        ORDER BY F01, F02, F05";

$stmt = $link->prepare($sql);
$stmt->bind_param("ss", $f03_val, $f90_val);
$stmt->execute();
$result = $stmt->get_result();

$arr = [];
while ($row = $result->fetch_assoc()) {
    $qty   = (float)$row['F06'];
    $price = (float)$row['F07'];
    $rate  = (float)$row['F14'];
    
    $arr[] = [
        'ship_date_DSL_008'       => $row['F01'],
        'invoice_no_DSL_009'      => $row['F17'],
        'stock_no_DSL_012'        => $row['F05'],
        'bill_no_DSL_009'         => $row['F02'],
        'ship_qty_DSR_007'        => $qty,
        'unit_price_DSR_007'      => $price,
        'crncy_type_DSC_004'      => $row['F13'],
        'crncy_rate_DSR_007'      => $rate,
        // 財務運算建議先乘後除，確保精度
        'rcd_total_DSR_008'       => round($qty * $price * $rate, $rnddgt),
        'customer_po_DSL_009'     => $row['F04'],
        'customer_partno_DSL_011' => $row['F08']
    ];
}

echo json_encode(['recdrow' => $arr]);
$stmt->close();
$link->close();