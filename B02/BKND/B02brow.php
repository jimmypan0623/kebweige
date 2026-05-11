<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$arr = array();
$pgeno_val = ""; // 儲存月次批號 (F90)

// --- 1. 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式為 b02.Fxx, d01.Fxx 或 a01.Fxx
    return preg_match('/^((b02|d01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 統一的欄位選取與 JOIN 設定 (對應 B02 邏輯)
$columns = "b02.F00, b02.F01, b02.F02, b02.F06, b02.F10, b02.F09, b02.F11, b02.F12, b02.F14, b02.F16, b02.F20, b02.F21, b02.F22, b02.F23, b02.F24,
            b02.F90,d01.F04 as F0D, d01.F03 AS F0C, d01.F06 AS F1Z, d01.F08 AS F1B, d01.F09 AS F0I, a01.F03 as F0G,d00.F04 AS F0H";

$joins = "FROM b02 
          LEFT OUTER JOIN d01 ON d01.F01 = b02.F06
          LEFT OUTER JOIN a01 ON a01.F01 = b02.F09 
          LEFT OUTER JOIN d00 ON d00.F01 = b02.F14";
// 2. 判斷模式
$filename = $_POST['filename'] ?? '';

if (substr($filename, 0, 3) == "PGE") {
    // --- 月次模式 ---
    $pgeno_val = getNeedBetween($filename, 'E', '|');
    
    $sql = "SELECT $columns $joins WHERE b02.F90 = ? ORDER BY b02.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $pgeno_val);

} else if (strpos($filename, '|') !== false) {
    // --- 搜尋模式 (欄位|關鍵字_批號) ---
    $parts = explode('|', $filename);
    $fieldNo = trim($parts[0]);
    
    // 解析關鍵字與月次批號
    $filterValue = trim(getNeedBetween($filename, '|', '_'));
    $filterKey = "%$filterValue%";
    $pgeno_val = substr(strrchr($filename, '_'), 1);

    // 安全檢查
    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 確保欄位有正確的主表前綴
    if (stripos($fieldNo, '.') === false) {
        $fieldNo = "b02." . $fieldNo;
    }

    $sql = "SELECT $columns $joins WHERE b02.F90 = ? AND $fieldNo LIKE ? ORDER BY $fieldNo, b02.F02 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $pgeno_val, $filterKey);
} else {
    die(json_encode(array('error' => 'Format error', 'received' => $filename)));
}

// 3. 執行查詢
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 4. 查詢結轉狀態 (a23)
$sqlStatus = "SELECT F07 FROM a23 WHERE F01 = ?";
$stmtStatus = mysqli_prepare($link, $sqlStatus);
mysqli_stmt_bind_param($stmtStatus, "s", $pgeno_val);
mysqli_stmt_execute($stmtStatus);
$resStatus = mysqli_stmt_get_result($stmtStatus);
$list4 = mysqli_fetch_assoc($resStatus);
$pgttl = $list4['F07'] ?? '';

// 5. 取得欄位寬度並整理資料 (Table B02)
$wthary = fldwdthpre('B02', '1', $link);

while ($list3 = mysqli_fetch_assoc($result)) {
    $arr[] = array(
        'rc_no' . ($wthary[0] ?? '')           => $list3['F00'],
        'query_no' . ($wthary[1] ?? '')        => $list3['F01'],
        'custom_no' . ($wthary[2] ?? '')       => $list3['F06'],
        'custom_name' . ($wthary[3] ?? '')     => $list3['F0D'], // 對應 d01.F04
        'custom_fullname' . ($wthary[4] ?? '') => $list3['F0C'], // 對應 d01.F03
        'unitedno' . ($wthary[5] ?? '')        => $list3['F1Z'], // 對應 d01.F06
        'contact' . ($wthary[6] ?? '')         => $list3['F1B'], // 對應 d01.F08
        'tel' . ($wthary[7] ?? '')             => $list3['F0I'], // 對應 d01.F09
        'query_date' . ($wthary[8] ?? '')      => $list3['F02'],
        'sales_no' . ($wthary[9] ?? '')        => $list3['F09'],
        'sales_name' . ($wthary[10] ?? '')     => $list3['F0G'], // 對應 a01.F03
        'crncy_type' . ($wthary[11] ?? '')     => $list3['F14'],
		'crncy_name' . ($wthary[12] ?? '')     => $list3['F0H'],
        'crncy_rate' . ($wthary[13] ?? '')     => $list3['F16'],
        'invoice_no' . ($wthary[14] ?? '')     => $list3['F20'],
        'invoice_type' . ($wthary[15] ?? '')   => $list3['F22'],
        'tax_type' . ($wthary[16] ?? '')       => $list3['F23'],
        'payment' . ($wthary[17] ?? '')        => $list3['F21'],
        'ship_no' . ($wthary[18] ?? '')        => $list3['F12'], 
        'ship_direct' . ($wthary[19] ?? '')    => $list3['F24'],
		'ship_date' . ($wthary[20] ?? '')          => $list3['F90'],
        'shure' . ($wthary[21] ?? '')          => $list3['F10'],
        'lastupdate' . ($wthary[22] ?? '')     => $list3['F11']
    );
}

mysqli_stmt_close($stmt);
mysqli_stmt_close($stmtStatus);
mysqli_close($link);

// 6. 輸出結果
echo json_encode(array('recdrow' => array_values($arr), 'pgttl' => $pgttl), JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>