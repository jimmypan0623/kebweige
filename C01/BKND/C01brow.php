<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$rows = 0;
$arr = array();

// 讀取小數位數參數，預設為 0，限制在 0-6 之間
$rndnb = isset($_COOKIE['INT_001']) ? (int)$_COOKIE['INT_001'] : 0;
$rndnb = max(0, min($rndnb, 6));

// --- 輔助函式：白名單檢查欄位名，防止 SQL 注入 ---
function isValidField($field) {
    // 限制欄位格式為 c01.Fxx 或相關關聯表的 Fxx
    return preg_match('/^((c01|a01|c00|a0A|a0B)\.)?F[0-9]{2}$/i', $field);
}

// 1. 統一的欄位選取 (對應 c01 客戶主檔)
$columns = "c01.F00, c01.F01, c01.F03, c01.F04, c01.F05, c01.F06, c01.F07, c01.F08, c01.F09,
            c01.F10, c01.F11, c01.F12, c01.F13, c01.F14, c01.F15, c01.F16, c01.F17, c01.F19, 
            c01.F20, c01.F21, c01.F22, c01.F23, a0B.F03 as F03B, c01.F25, c01.F26, c01.F29, 
            c01.F30, c01.F31, c01.F32, c01.F33, a0A.F03 as F03A, c01.F36, c01.F38, c01.F39, 
            c00.F04 AS F0D, c01.F40, c01.F41, c01.F42, c01.F43, c01.F44";

$joins = "FROM `c01` 
          LEFT OUTER JOIN `a01` AS a0A ON c01.F33 = a0A.F01 
          LEFT OUTER JOIN `a01` AS a0B ON c01.F23 = a0B.F01 
          LEFT OUTER JOIN `c00` ON c00.F01 = c01.F39";

// 2. 判斷模式：分頁 (PGE) 或 搜尋
if (substr($_POST['filename'], 0, 3) == "PGE") {
    // --- 分頁模式 ---
    $pgeno = (int)getNeedBetween($_POST['filename'], 'E', '|');
    $rows = (int)getNeedBetween($_POST['filename'], '|', '_');
    $pagerows = (int)substr(strrchr($_POST['filename'], '_'), 1);
    
    // 如果是初始載入，計算總筆數
    if ($rows <= 0) {
        $resK = mysqli_query($link, "SELECT COUNT(F01) as total FROM `c01` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;
    $sql = "SELECT $columns $joins ORDER BY c01.F01 LIMIT ?, ?";
    
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {
    // --- 搜尋模式 ---
    $parts = explode('|', $_POST['filename']);
    $fieldNo = $parts[0];
    $filterValue = trim($parts[1] ?? '');
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field access')));
    }

    // 確保欄位有名稱前綴
    if (stripos($fieldNo, '.') === false) { $fieldNo = "c01." . $fieldNo; }

    $sql = "SELECT $columns $joins WHERE $fieldNo LIKE ? ORDER BY $fieldNo";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
}

// 3. 執行查詢
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 獲取欄位寬度配置 (Table ID: C01)
$wthary = fldwdthpre('C01', '1', $link);

// 4. 資料封裝
while ($list3 = mysqli_fetch_assoc($result)) {
    $atr = array(
        'rc_no'.$wthary[0] => $list3['F00'],
        'custom_no'.$wthary[1] => $list3['F01'],
        'custom_name'.$wthary[2] => $list3['F04'],
        'custom_abbrv'.$wthary[3] => $list3['F05'],
        'level'.$wthary[4] => $list3['F03'],
        'unitedno'.$wthary[5] => $list3['F10'],
        'typeofbusiness'.$wthary[6] => $list3['F43'],
        'product'.$wthary[7] => $list3['F21'],
        'area'.$wthary[8] => $list3['F20'],
        'invoicename'.$wthary[9] => $list3['F41'],
        'invoicepartno'.$wthary[10] => $list3['F42'],
        'typeofinvoice'.$wthary[11] => $list3['F29'],
        'typeoftax'.$wthary[12] => $list3['F30'],
        'englishname'.$wthary[13] => $list3['F09'],
        'address'.$wthary[14] => $list3['F06'],
        'addressforship'.$wthary[15] => $list3['F07'],
        'englishaddress'.$wthary[16] => $list3['F08'],
        'indicateforship'.$wthary[17] => $list3['F32'],
        'contact'.$wthary[18] => $list3['F12'],
        'boss'.$wthary[19] => $list3['F11'],
        'tel'.$wthary[20] => $list3['F13'],
        'fax'.$wthary[21] => $list3['F14'],
        'email'.$wthary[22] => $list3['F22'],
        'groupno'.$wthary[23] => $list3['F44'],
        'moneycrnt'.$wthary[24] => $list3['F39'],
        'crntname'.$wthary[25] => $list3['F0D'],
        'dayofincount'.$wthary[26] => $list3['F17'],
        'dayofcharge'.$wthary[27] => $list3['F38'],
        'wayofpay'.$wthary[28] => $list3['F15'],
        'paymentterm'.$wthary[29] => $list3['F36'],
        'salesno'.$wthary[30] => $list3['F33'],
        'salesname'.$wthary[31] => $list3['F03A'],
        'assistantno'.$wthary[32] => $list3['F23'],
        'assistantname'.$wthary[33] => $list3['F03B'],
        'wayofship'.$wthary[34] => $list3['F31'],
        'receiver'.$wthary[35] => $list3['F40'],
        'remark'.$wthary[36] => $list3['F25'],
        'lasttrade'.$wthary[37] => $list3['F16'],
        'lastquot'.$wthary[38] => $list3['F19'],
        'lastupdate'.$wthary[39] => $list3['F26']
    );
    $arr[] = $atr;
}

// 5. 關閉資源並輸出
mysqli_stmt_close($stmt);
mysqli_close($link);

if (ob_get_length()) ob_clean(); // 清除可能的潛在輸出緩衝
echo json_encode(array('recdrow' => $arr, 'pgttl' => (int)$rows), JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>