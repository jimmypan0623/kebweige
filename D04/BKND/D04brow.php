<?php
// 開啟錯誤回報 (除錯完畢後請關閉)
// ini_set('display_errors', 1); error_reporting(E_ALL);

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 確保 $link 存在，避免直接崩潰
if (!isset($link)) {
    die(json_encode(array('error' => 'Database connection variable $link not found.')));
}

function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}

function isValidField($field) {
    // 增加 d00 的白名單檢查
    return preg_match('/^((d03|d01|a01|d00)\.)?F[0-9]{2}$/i', $field);
}

$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$arr = array();
$total_rows = 0;

// 統一欄位與 JOIN 以免重複出錯
$select_cols = "d03.F00, d03.F01, d03.F02, d03.F03, d03.F04, d03.F06, d03.F07, d03.F08, d03.F10, d03.F12, d03.F14, d03.F13,
                d01.F04 as F0D, d01.F03 AS F0C, a01.F03 as F0G, d00.F04 AS F0H";
$join_sql = "FROM d03 
             LEFT OUTER JOIN d01 ON d01.F01 = d03.F03
             LEFT OUTER JOIN a01 ON a01.F01 = d03.F07 
             LEFT OUTER JOIN d00 ON d00.F01 = d03.F12";

if (substr($filename, 0, 3) == "PGE") {
    $pgeno = (int)getNeedBetween($filename, 'E', '|'); 
    $total_rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);
    
    if ($total_rows <= 0) {
        $resK = mysqli_query($link, "SELECT COUNT(F00) as cnt FROM d03");
        $rowK = mysqli_fetch_assoc($resK);
        $total_rows = (int)$rowK['cnt'];
    }

    $start_row = $pagerows * ($pgeno - 1);
    $sql = "SELECT $select_cols $join_sql ORDER BY d03.F01 DESC LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);
} else {
    // 搜尋模式解析優化
    $parts = explode('|', $filename);
    $fieldNo = trim($parts[0] ?? 'd03.F01');
    $filterKey = trim($parts[1] ?? '');
    $searchValue = "%$filterKey%";

    if (!isValidField($fieldNo)) { $fieldNo = "d03.F01"; }
    if (stripos($fieldNo, '.') === false) { $fieldNo = "d03." . $fieldNo; }

    $sql = "SELECT $select_cols $join_sql WHERE $fieldNo LIKE ? ORDER BY $fieldNo ASC, d03.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $searchValue);
}

// 執行 SQL
if ($stmt && mysqli_stmt_execute($stmt)) {
    $result = mysqli_stmt_get_result($stmt);
    if (!$filename || substr($filename, 0, 3) != "PGE") {
        $total_rows = mysqli_num_rows($result);
    }
} else {
    // 如果 SQL 執行失敗，回傳錯誤訊息而非直接 500
    die(json_encode(array('error' => 'SQL Execution Failed: ' . mysqli_error($link))));
}

$wthary = fldwdthpre('D04', '1', $link);
$afld=['F00','F01','F03','F0D','F0C','F02','F07','F0G','F12','F0H','F14','F06','F13','F08','F04','F10'];
$arr=afldcont($result,$afld,$wthary);

mysqli_stmt_close($stmt);
mysqli_close($link);

if (ob_get_length()) ob_clean();
echo json_encode(array('recdrow' => $arr, 'pgttl' => (int)$total_rows), JSON_UNESCAPED_UNICODE);
?>