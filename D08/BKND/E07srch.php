<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");

// 1. 確保接收到資料且格式正確
if (!isset($_POST['filename'])) {
    echo json_encode(["error" => "缺少參數"]);
    exit;
}

$str = explode('|', $_POST['filename']);
$stock_no = $str[0];
$running_qty = isset($str[1]) ? (float)$str[1] : 0.0;

// 2. 使用 Prepared Statement (預處理語句)
$sql = "
    (SELECT c04.F00, c04.F01, c04.F02, c04.F06, (c04.F03-c04.F09-c04.F21)*(-1) AS RST, c03.F03, c01.F05 AS ABR 
     FROM c04 
     LEFT JOIN c03 ON c03.F01=c04.F01 
     LEFT JOIN c01 ON c01.F01=c03.F03 
     WHERE c04.F02=? AND (c04.F03-c04.F09-c04.F21) > 0 AND c03.F04='Y')
    UNION
    (SELECT d04.F00, d04.F01, d04.F02, d04.F06, (d04.F03-d04.F09-d04.F21) AS RST, d03.F03, d01.F04 AS ABR 
     FROM d04 
     LEFT JOIN d03 ON d03.F01=d04.F01 
     LEFT JOIN d01 ON d01.F01=d03.F03 
     WHERE d04.F02=? AND (d04.F03-d04.F09-d04.F21) > 0 AND d03.F04='Y')
    ORDER BY F06 ASC, RST DESC";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "ss", $stock_no, $stock_no); // 綁定兩次料號
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$data = array();

while ($row = mysqli_fetch_assoc($result)) {
    $change = (float)$row['RST'];
    $running_qty = round($running_qty + $change, 4); // 四捨五入處理，避免浮點數誤差

    $prefix = substr($row['F01'], 0, 2);
    
    $data[] = [
        '序號_IHC_000'      => $prefix . $row['F00'],
        '單據號碼_ISC_010'   => $row['F01'],
        '異動_ISC_004' => ($prefix == 'CA') ? '出貨' : '進貨',
        '異動日期_ISC_010'   => $row['F06'],
        '異動數量_ISR_010' => $change,
        '預期結餘_ISR_010' => $running_qty,
        '對象編號_ISC_007'     => $row['F03'],
        '對象簡稱_ISC_008'   => $row['ABR']
    ];
}

mysqli_stmt_close($stmt);
mysqli_close($link);

echo json_encode($data);
?>