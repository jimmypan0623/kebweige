<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$rnddgt = isset($_COOKIE["INT_069"]) ? intval($_COOKIE["INT_069"]) : 0;
$filename = $_POST['filename'] ?? '';

// 初始參數解析
if (substr($filename, 0, 3) == "PGE") {
    $pgeno = getNeedBetween($filename, 'E', '|');
    $fieldNo = "c01.F01"; 
    $filterKey = null;
} else {
    $fieldNo = mysqli_real_escape_string($link, substr($filename, 0, 7));
    $filterKey = getNeedBetween($filename, '|', '_');
    $pgeno = substr(strrchr($filename, '_'), 1);
}

// 1. 取得結轉狀態 (a23)
$stmt0 = $link->prepare("SELECT F07 FROM a23 WHERE F01 = ?");
$stmt0->bind_param("s", $pgeno);
$stmt0->execute();
$res0 = $stmt0->get_result();
$trans_code = ($row = $res0->fetch_assoc()) ? $row['F07'] : '';

// 2. 取得客戶清單 (改用 JOIN 提升效能)
$sql = "SELECT DISTINCT c01.F01, c01.F04, c01.F05
        FROM c01 
        INNER JOIN c13 ON c01.F01 = c13.F03 
        WHERE c13.F90 = ?";

if ($filterKey !== null) {
    $sql .= " AND $fieldNo LIKE ?";
}
$sql .= " ORDER BY $fieldNo";

$stmt = $link->prepare($sql);
if ($filterKey !== null) {
    $likeKey = "%" . trim($filterKey) . "%";
    $stmt->bind_param("ss", $pgeno, $likeKey);
} else {
    $stmt->bind_param("s", $pgeno);
}
$stmt->execute();
$result = $stmt->get_result();
$wthary = fldwdthpre('C12', '1', $link);
$afld=['F01','F04','F05'];
$arr=afldcont($result,$afld,$wthary);
echo json_encode(['recdrow' => $arr, 'transcode' => $trans_code]);

function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}