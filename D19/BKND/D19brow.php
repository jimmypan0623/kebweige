<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 取得進位設定與參數
$rnddgt = isset($_COOKIE["INT_069"]) ? intval($_COOKIE["INT_069"]) : 0;
$filename = $_POST['filename'] ?? '';

// 解析 PGENO 與過濾條件
if (substr($filename, 0, 3) == "PGE") {
    $pgeno = getNeedBetween($filename, 'E', '|');
    $fieldNo = "d01.F01"; // 預設排序欄位
    $filterKey = null;
} else {
    // 安全性：白名單過濾欄位名稱，防止 SQL 注入
    $rawField = substr($filename, 0, 7);
    $fieldNo = preg_replace('/[^a-zA-Z0-9._]/', '', $rawField); 
    $filterKey = getNeedBetween($filename, '|', '_');
    $pgeno = substr(strrchr($filename, '_'), 1);
}

// 1. 取得結轉狀態 (a23)
$stmt0 = $link->prepare("SELECT F07 FROM a23 WHERE F01 = ?");
$stmt0->bind_param("s", $pgeno);
$stmt0->execute();
$res0 = $stmt0->get_result();
$trans_code = ($row = $res0->fetch_assoc()) ? $row['F07'] : '';

// 2. 取得廠商清單 (改用 JOIN 替代 IN 子查詢以提升效能)
$sql = "SELECT DISTINCT d01.F01, d01.F03, d01.F04 
        FROM d01 
        INNER JOIN d19 ON d01.F01 = d19.F03 
        WHERE d19.F90 = ?";

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

// 取得 UI 欄位寬度預設
$wthary = fldwdthpre('D19', '1', $link);
$afld=['F01','F03','F04'];
$arr=afldcont($result,$afld,$wthary);
mysqli_close($link);
// 輸出 JSON
echo json_encode([
    'recdrow' => $arr, 
    'transcode' => $trans_code
]);

function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}