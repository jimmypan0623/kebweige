<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$rows = 0;
$arr = array();

// --- 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式為 d01.Fxx，防止非法 SQL 指令
    return preg_match('/^((d01|a01|d00)\.)?F[0-9]{2}$/i', $field);
}

// 統一的欄位選取 (對應 d01 供應商主檔)
$columns = "d01.F00, d01.F01, d01.F03, d01.F04, d01.F12, d01.F06, d01.F11, d01.F19, d01.F05, d01.F21, d01.F08,
            d01.F07, d01.F09, d01.F10, d01.F22, d01.F25, d00.F04 AS F0D, d01.F15, d01.F38, d01.F13, d01.F36, d01.F39, 
            a01.F03 as F03A, d01.F16, d01.F14, d01.F18";

$joins = "FROM `d01` 
          LEFT OUTER JOIN `a01` ON d01.F39 = a01.F01 
          LEFT OUTER JOIN `d00` ON d00.F01 = d01.F25";

// 判斷分頁模式 (PGE) 或 搜尋模式
if (substr($_POST['filename'], 0, 3) == "PGE") {
    // 1. 分頁模式
    $pgeno = (int)getNeedBetween($_POST['filename'], 'E', '|');
    $rows = (int)getNeedBetween($_POST['filename'], '|', '_');
    $pagerows = (int)substr(strrchr($_POST['filename'], '_'), 1);
    
    // 初次載入算總筆數
    if ($rows <= 0) {
        $resK = mysqli_query($link, "SELECT COUNT(F01) as total FROM `d01` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;
    $sql = "SELECT $columns $joins ORDER BY d01.F01 LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {
    // 2. 搜尋模式
    $fieldNo = substr($_POST['filename'], 0, 7);
    $filterValue = trim(substr(strrchr($_POST['filename'], '|'), 1));
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 確保欄位有名稱前綴
    if (stripos($fieldNo, '.') === false) { $fieldNo = "d01." . $fieldNo; }

    $sql = "SELECT $columns $joins WHERE $fieldNo LIKE ? ORDER BY $fieldNo, d01.F01";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
}

// 執行查詢
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 獲取欄位配置 (Table: D01)
$wthary = fldwdthpre('D01', '1', $link);

while ($list3 = mysqli_fetch_assoc($result)) {
    $atr = array(
        'rc_no'.$wthary[0] => $list3['F00'],
        'vender_no'.$wthary[1] => $list3['F01'],
        'vender_name'.$wthary[2] => $list3['F03'],
        'vender_abbrv'.$wthary[3] => $list3['F04'],
        'level'.$wthary[4] => $list3['F12'],
        'unitedno'.$wthary[5] => $list3['F06'],
        'product'.$wthary[6] => $list3['F11'],
        'wayofship'.$wthary[7] => $list3['F19'],
        'address'.$wthary[8] => $list3['F05'],
        'addressoffactory'.$wthary[9] => $list3['F21'],
        'contact'.$wthary[10] => $list3['F08'],
        'boss'.$wthary[11] => $list3['F07'],
        'tel'.$wthary[12] => $list3['F09'],
        'fax'.$wthary[13] => $list3['F10'],
        'email'.$wthary[14] => $list3['F22'],
        'moneycrnt'.$wthary[15] => $list3['F25'],
        'crntname'.$wthary[16] => $list3['F0D'],
        'dayofincount'.$wthary[17] => $list3['F15'],
        'dayofcharge'.$wthary[18] => $list3['F38'],
        'wayofpay'.$wthary[19] => $list3['F13'],
        'paymentterm'.$wthary[20] => $list3['F36'],
        'procureno'.$wthary[21] => $list3['F39'],
        'procurename'.$wthary[22] => $list3['F03A'],
        'remark'.$wthary[23] => $list3['F16'],
        'lasttrade'.$wthary[24] => $list3['F14'],
        'lastupdate'.$wthary[25] => $list3['F18']
    );
    $arr[] = $atr;
}

mysqli_stmt_close($stmt);
mysqli_close($link);

echo json_encode(array('recdrow' => $arr, 'pgttl' => (int)$rows), JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>