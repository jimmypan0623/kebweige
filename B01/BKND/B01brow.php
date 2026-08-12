<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$filename = $_POST['filename'] ?? '';
if (empty($filename)) {
    echo json_encode(['error' => 'Invalid parameters']);
    exit;
}

// 取得小數點位數設定
$rndnb = 0;
$sq20 = "SELECT F06 FROM a26 WHERE F01='INT_001'"; 
if ($sql7 = mysqli_query($link, $sq20)) {
    $list8 = mysqli_fetch_assoc($sql7);
    $rndnb = isset($list8['F06']) ? (int)$list8['F06'] : 0;
    $rndnb = max(0, min($rndnb, 6));
}

function isValidField($field) {
    return preg_match('/^((b01|a14)\.)?F[0-9]{2}$/i', $field);	
}

// 欄位設定
$columns = "b01.F00, b01.F01, b01.F02, b01.F03, b01.F04, b01.F06, b01.F98, b01.F05,
            b01.F07, a14.F02 AS F0B, b11B.nTqty, b11A.nWHqty AS F0D, b01.F10, b01.F11, 
            b01.F41, b01.F97, b01.F28, b01.F31, b01.F39, b01.F30, b01.F38, b01.F37, 
            b01.F21, b01.F29, b01.F42, b01.F49";

// 優化後的 JOIN 邏輯 (特定倉庫庫存 b11A 亦加上 SUM GROUP BY，防止重複資料列)
$joins = "FROM `b01` 
          LEFT JOIN `a14` ON a14.F01 = b01.F07 
          LEFT JOIN (
              SELECT F03, SUM(F04) AS nTqty 
              FROM b11 GROUP BY F03
          ) AS b11B ON b11B.F03 = b01.F01 
          LEFT JOIN (
              SELECT F03, F01, SUM(F04) AS nWHqty 
              FROM b11 GROUP BY F03, F01
          ) AS b11A ON b01.F01 = b11A.F03 AND b01.F07 = b11A.F01";

$rows = 0;

if (str_starts_with($filename, "PGE")) {
    // 1. 分頁模式處理
    $pgeno = (int)getNeedBetween($filename, 'E', '|');
    $rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);
    
    if ($rows <= 0) {		
        $resK = mysqli_query($link, "SELECT COUNT(*) as total FROM `b01` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)($rowK['total'] ?? 0);
    }

    $start_row = max(0, ($pgeno - 1) * $pagerows);

    $sql = "SELECT $columns $joins ORDER BY b01.F01 LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {    
    // 2. 搜尋模式
    $parts = explode('|', $filename);
    $fieldNo = $parts[0] ?? '';
    $filterValue = trim($parts[1] ?? '');
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        echo json_encode(['error' => 'Invalid Field: ' . $fieldNo]);
        exit;
    }

    if (!str_contains($fieldNo, '.')) {
        $fieldNo = "b01." . $fieldNo;
    }

    // 建議：若不需要強制區分大小寫，可將 BINARY 移除以提升索引查詢速度
    $sql = "SELECT $columns $joins WHERE $fieldNo LIKE ? ORDER BY $fieldNo, b01.F01";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$wthary = fldwdthpre('B01', '1', $link);
$afld = ['F00','F01','F02','F06','F98','F03','F04','F05','F07','F0B','nTqty','F0D','F10','F11','F41','F97','F39','F30','F28',
         'F31','F38','F37','F29','F42','F49','F21'];
$length = count($afld);
$arr = [];

while ($list3 = mysqli_fetch_assoc($result)) {   
    $atr = [];
    for ($i = 0; $i < $length; $i++) {
        $key = $afld[$i];
        $val = $list3[$key] ?? '';

        if ($key === 'nTqty' || $key === 'F0D') {  
            // 安全處理 round，防範 null
            $atr[$wthary[$i]] = ($val !== '' && $val !== null) ? round((float)$val, $rndnb) : 0;
        } else {
            $atr[$wthary[$i]] = $val;
        }
    }
    $arr[] = $atr;
}

mysqli_stmt_close($stmt);
mysqli_close($link);

if (ob_get_length()) ob_clean(); 

echo json_encode(['recdrow' => $arr, 'pgttl' => (int)$rows], JSON_UNESCAPED_UNICODE);

function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>