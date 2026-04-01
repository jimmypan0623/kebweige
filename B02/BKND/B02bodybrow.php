<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$filename = $_POST['filename'] ?? '';
$params = explode('|', $filename);

if (count($params) < 3) {
    die(json_encode(['recdrow' => [], 'pgttl' => 0, 'error' => 'Format error']));
}

$mainOrderNo = trim($params[0]); 
$rawField    = trim($params[1]); 
$keyword     = "%" . trim($params[2]) . "%"; 

function isValidDetailField($field) {
    return preg_match('/^((b0b|b01|a14)\.)?F[0-9]{2}$/i', $field);
}

if (!isValidDetailField($rawField)) {
    die(json_encode(['error' => 'Invalid Field: ' . $rawField]));
}

$searchField = (strpos($rawField, '.') !== false) ? $rawField : "b0b." . $rawField;

$sql = "SELECT b0b.*, b01.F02 AS F0B, a14.F02 AS F0C 
        FROM `b0b` 
        LEFT OUTER JOIN `b01` ON b0b.F03 = b01.F01 
        LEFT OUTER JOIN `a14` ON b0b.F05 = a14.F01 
        WHERE b0b.F01 = ? AND $searchField LIKE ? 
        ORDER BY b0b.F03 ASC";

$stmt = $link->prepare($sql);
$stmt->bind_param("ss", $mainOrderNo, $keyword);
$stmt->execute();
$result = $stmt->get_result();

$wthary = fldwdthpre('B02', '2', $link);
$arr = array();

while ($list = $result->fetch_assoc()) {
    // 建立一個處理函式，移除換行符號防止撐開 Grid 高度
    $clean = function($val) {
        return str_replace(["\r", "\n", "\t"], '', trim($val));
    };

    $arr[] = array(
        'rc_no' . ($wthary[0] ?? '')          => $clean($list['F00']),
        'stockno' . ($wthary[1] ?? '')        => $clean($list['F03']),
        'stocknam' . ($wthary[2] ?? '')       => $clean($list['F0B']), 
        'order_no' . ($wthary[3] ?? '')       => $clean($list['F07']),
        'query_qty' . ($wthary[4] ?? '')      => (float)$list['F04'],
        'query_price' . ($wthary[5] ?? '')    => (float)$list['F15'],
        'dept_no' . ($wthary[6] ?? '')        => $clean($list['F05']),
        'dept_name' . ($wthary[7] ?? '')      => $clean($list['F0C']), 
        'vendor_partno' . ($wthary[8] ?? '')  => $clean($list['F08']),
        'vendor_po' . ($wthary[9] ?? '')      => $clean($list['F09']),
        'remark' . ($wthary[10] ?? '')        => $clean($list['F25']),
        'lastupdate' . ($wthary[11] ?? '')    => $clean($list['F11'])
    );
}

$stmt->close();
mysqli_close($link);

echo json_encode([
    'recdrow' => $arr,
    'pgttl'   => count($arr)
], JSON_UNESCAPED_UNICODE);
?>