<?php
header("Content-Type: application/json; charset=utf-8"); // 改為 JSON 輸出格式
require_once("../../include/BKND/mysqli_server.php");
require_once("../../include/BKND/fieldpreset.php");

// 初始化變數
$arr = [];
$total_rows = 0;
$filename = $_POST['filename'] ?? '';

// 輔助函式：抓取兩個字元間的字串
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return 0;
    return substr($kw, $st + 1, $ed - $st - 1);
}

// 基礎 SQL 語句
$baseSql = "SELECT c34.F00, c34.F01, c34.F02, c34.F03, c34.F04, c34.F05, 
                   c01.F05 as F0E, b01.F02 as F0B 
            FROM c34 
            LEFT JOIN c01 ON c01.F01 = c34.F01 
            LEFT JOIN b01 ON b01.F01 = c34.F02";

if (strpos($filename, "PGE") === 0) {
    // --- 分頁模式 ---
    $pgeno = (int)getNeedBetween($filename, 'E', '|');
    $total_rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);
    
    // 如果沒有總筆數，才去計算
    if ($total_rows <= 0) {
        $countRes = mysqli_query($link, "SELECT COUNT(F01) as cnt FROM c34");
        $countRow = mysqli_fetch_assoc($countRes);
        $total_rows = (int)$countRow['cnt'];
    }

    $start_rowrecord = $pagerows * ($pgeno - 1);
    $sql = $baseSql . " ORDER BY c34.F02 LIMIT ?, ?";
    
    // 使用 Prepare Statement 避免注入
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_rowrecord, $pagerows);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

} else {
    // --- 搜尋模式 ---
    $fieldNo = substr($filename, 0, 7);
    $filterKey = trim(substr(strrchr($filename, '|'), 1));
    
    // 這裡應檢查 $fieldNo 是否為合法欄位名，避免 SQL 注入
    $allowedFields = ['c34.F01', 'c34.F02']; // 舉例，應按實際欄位清單過濾
    
    $sql = $baseSql . " WHERE $fieldNo LIKE ? ORDER BY $fieldNo";
    $stmt = mysqli_prepare($link, $sql);
    $searchKey = "%$filterKey%";
    mysqli_stmt_bind_param($stmt, "s", $searchKey);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $total_rows = mysqli_num_rows($result);
}

// 取得欄位寬度設定
$wthary = fldwdthpre('C34', '1', $link);

while ($list3 = mysqli_fetch_assoc($result)) {
    $arr[] = [
        'rc_no' . ($wthary[0] ?? '')          => $list3['F00'],
        'stock_no' . ($wthary[1] ?? '')       => $list3['F02'],
        'stock_name' . ($wthary[2] ?? '')     => $list3['F0B'],
        'custom_no' . ($wthary[3] ?? '')      => $list3['F01'],
        'custom_name' . ($wthary[4] ?? '')    => $list3['F0E'],
        'custom_partno' . ($wthary[5] ?? '')  => $list3['F03'],
        'origin_data' . ($wthary[6] ?? '')    => $list3['F04'],
        'lastupdate' . ($wthary[7] ?? '')     => $list3['F05']
    ];
}

mysqli_close($link);

// 輸出結果
echo json_encode([
    'recdrow' => $arr,
    'pgttl' => $total_rows
], JSON_UNESCAPED_UNICODE);
?>