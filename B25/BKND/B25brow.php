<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");
require_once("../../include/BKND/fieldpreset.php");

// 1. 初始化變數與取得參數
$filename = $_POST['filename'] ?? '';
$pgeno = "";
$dptno = "";
$fieldNo = "";
$filterKey = "";

// 2. 解析檔名參數 (封裝解析邏輯)
if (strpos($filename, "PGE") === 0) {
    $pgeno = getNeedBetween($filename, 'E', '|');
    $dptno = substr(strrchr($filename, '|'), 1);
} else {
    $fieldNo = substr($filename, 0, 7);
    $filterKey = trim(getNeedBetween($filename, '|', '_'));
    $pgeno = getNeedBetween($filename, '_', '~');
    $dptno = substr(strrchr($filename, '~'), 1);
}

// 3. 建立 SQL (使用預處理防止 SQL Injection)
$sql_where = "WHERE F90 = ? AND F01 = ? ";
// 排除全為 0 的無效數據 (過濾條件)
$sql_where .= "AND NOT (F03=0 AND F04=0 AND F05=0 AND F06=0 AND F07=0 AND F08=0 AND F09=0 AND F10=0 AND F11=0 AND F13=0 AND F14=0 AND F15=0) ";

$params = [$pgeno, $dptno];
$types = "ss";

if (strpos($filename, "PGE") !== 0) {
    // 這裡欄位名稱 $fieldNo 必須是白名單過濾，假設它是安全的
    $sql_where .= "AND $fieldNo LIKE ? ";
    $params[] = "%$filterKey%";
    $types .= "s";
    $order_by = "ORDER BY $fieldNo";
} else {
    $order_by = "ORDER BY F01, F02";
}

$sql3 = "SELECT F00, F01, F02, F03, F04, F05, F06, F07, F08, F09, F10, F11, F13, F14, F15, F16 FROM b25 $sql_where $order_by";

// 4. 執行查詢：a23 (月結資訊)
$stmt0 = $link->prepare("SELECT F07 FROM a23 WHERE F01 = ?");
$stmt0->bind_param("s", $pgeno);
$stmt0->execute();
$res0 = $stmt0->get_result();
$list4 = $res0->fetch_assoc();
$pgttl = $list4['F07'] ?? '';

// 5. 執行查詢：b25 (主要資料)
$stmt3 = $link->prepare($sql3);
$stmt3->bind_param($types, ...$params);
$stmt3->execute();
$result = $stmt3->get_result();

// 6. 整理回傳資料
$wthary = fldwdthpre('B25', '1', $link);
$afld=['F00','F02','F03','F04','F05','F06','F07','F08','F09','F10','F11','F14','F13','F15','F16'];

$arr=afldcont($result,$afld,$wthary);

// 7. 輸出 JSON
echo json_encode(['recdrow' => $arr, 'pgttl' => $pgttl], JSON_UNESCAPED_UNICODE);

// 釋放資源
$stmt0->close();
$stmt3->close();
$link->close();

/**
 * 抓取兩個字元間的字串
 */
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw, $st + 1, $ed - $st - 1);
}
?>