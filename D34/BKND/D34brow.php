<?php
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");
require_once("../../include/BKND/fieldpreset.php");

// 1. 輔助函式定義
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return 0;
    return substr($kw, $st + 1, $ed - $st - 1);
}

// 2. 初始化變數
$arr = [];
$total_rows = 0;
$filename = $_POST['filename'] ?? '';

// 基礎 SQL 定義 (D34 廠商對照表)
// 注意：依據您的原稿，d01 關聯欄位是 F04 (F0E)
$baseSql = "SELECT d34.F00, d34.F01, d34.F02, d34.F03, d34.F04, d34.F05, 
                   d01.F04 as F0E, b01.F02 as F0B 
            FROM d34 
            LEFT JOIN d01 ON d01.F01 = d34.F01 
            LEFT JOIN b01 ON b01.F01 = d34.F02";

// 3. 判斷模式：分頁 (PGE) 或 搜尋
if (strpos($filename, "PGE") === 0) {
    // --- 分頁模式 ---
    $pgeno = (int)getNeedBetween($filename, 'E', '|');
    $total_rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);
    
    // 如果總數為 0 或小於 1，執行效能較好的 COUNT 查詢
    if ($total_rows <= 0) {
        $resCount = mysqli_query($link, "SELECT COUNT(F01) as cnt FROM d34");
        $rowCount = mysqli_fetch_assoc($resCount);
        $total_rows = (int)$rowCount['cnt'];
    }

    $start_rowrecord = $pagerows * ($pgeno - 1);
    $sql = $baseSql . " ORDER BY d34.F02 LIMIT ?, ?";
    
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_rowrecord, $pagerows);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

} else {
    // --- 搜尋模式 ---
    $fieldNo = substr($filename, 0, 7);
    $filterKey = trim(substr(strrchr($filename, '|'), 1));
    
    // 安全過濾：確保 $fieldNo 只包含合法字元，防止 SQL 注入
    $fieldNo = preg_replace('/[^a-zA-Z0-9\._]/', '', $fieldNo);
    
    $sql = $baseSql . " WHERE $fieldNo LIKE ? ORDER BY $fieldNo";
    $stmt = mysqli_prepare($link, $sql);
    $searchKey = "%$filterKey%";
    mysqli_stmt_bind_param($stmt, "s", $searchKey);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $total_rows = mysqli_num_rows($result);
}

// 4. 取得欄位寬度設定
$wthary = fldwdthpre('D34', '1', $link);

// 5. 處理結果集
if ($result) {
	$afld=['F00','F02','F0B','F01','F0E','F03','F04','F05'];
    $arr=afldcont($result,$afld,$wthary);
    
}

mysqli_close($link);

// 6. JSON 輸出
echo json_encode([
    'recdrow' => array_values($arr),
    'pgttl'   => $total_rows
], JSON_UNESCAPED_UNICODE);