<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
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
 $clean = function($val) {
        return str_replace(["\r", "\n", "\t"], '', trim($val));
    };
$arr=array();	
$wthary = fldwdthpre('B02', '2', $link);
$afld=['F00','F03','F0B','F07','F04','F15','F05','F0C','F08','F09','F25','F11'];
$arr=afldcont($result,$afld,$wthary);


$stmt->close();
mysqli_close($link);

echo json_encode([
    'recdrow' => $arr,
    'pgttl'   => count($arr)
], JSON_UNESCAPED_UNICODE);
?>