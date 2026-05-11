<?php
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");
require_once("../../include/BKND/fieldpreset.php");

// 1. 初始化變數
$arr = [];
$total_rows = 0;
$today = new DateTime(); // 當前日期物件
$filename = $_POST['filename'] ?? '';

// 2. 定義核心篩選條件 (應付餘額 > 0 且 類別在指定範圍)
$baseCondition = "k25.F12 - k25.F27 > 0 AND (k25.F01 > '00' AND k25.F01 < '23')";
$baseSql = "SELECT k25.*, d01.F04 AS F0E, a14.F02 AS F0B, a01.F03 AS F0C 
            FROM k25 
            LEFT JOIN d01 ON d01.F01 = k25.F03 
            LEFT JOIN a14 ON a14.F01 = k25.F14 
            LEFT JOIN a01 ON a01.F01 = k25.F19";

// 3. 處理分頁與搜尋邏輯
if (strpos($filename, "PGE") === 0) {
    // --- 分頁模式 ---
    $pgeno = (int)getNeedBetween($filename, 'E', '|');
    $total_rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);

    if ($total_rows <= 0) {
        $countSql = "SELECT COUNT(*) as cnt FROM k25 WHERE $baseCondition";
        $resCount = mysqli_query($link, $countSql);
        $rowC = mysqli_fetch_assoc($resCount);
        $total_rows = (int)$rowC['cnt'];
    }

    $start = $pagerows * ($pgeno - 1);
    $sql = "$baseSql WHERE $baseCondition ORDER BY k25.F90, k25.F02, k25.F07 LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start, $pagerows);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

} else {
    // --- 搜尋模式最終穩定版 ---
	$str = explode('|', $_POST['filename']);
	$fieldRaw = trim($str[0] ?? ''); 
	$filterKey = trim($str[1] ?? '');
	$likeKey = "%$filterKey%";

	// 這裡的 Key 要跟前端 Option Value 100% 相同
	$shipdayTag = "CONCAT(k25.F90,'-',k25.F02)";

	$allowedFields = [
		$shipdayTag => 'SHIPDAY', 
		'k25.F15'   => 'k25.F15',
		'k25.F07'   => 'k25.F07',
		'k25.F03'   => 'k25.F03',
		'd01.F04'   => 'd01.F04', // 應收用 c01, 應付改 d01.F04
		'k25.F04'   => 'k25.F04',
		'k25.F19'   => 'k25.F19',
		'a01.F03'   => 'a01.F03',
		'k25.F25'   => 'k25.F25'
	];

	if (isset($allowedFields[$fieldRaw]) && $allowedFields[$fieldRaw] === 'SHIPDAY') {
        // --- 日期搜尋強化版 ---
        // 1. 比對 F90 (年月)
        // 2. 比對 F02 (日)
        // 3. 比對 CONCAT(F90, '-', F02) (完整日期，支援如 12-11 的輸入)
        $sql = "$baseSql WHERE $baseCondition AND (
                    k25.F90 LIKE ? OR 
                    k25.F02 LIKE ? OR 
                    CONCAT(k25.F90, '-', k25.F02) LIKE ?
                ) ORDER BY k25.F90, k25.F02, k25.F07";
        
        $stmt = mysqli_prepare($link, $sql);
        // 這裡需要綁定 3 個參數
        mysqli_stmt_bind_param($stmt, "sss", $likeKey, $likeKey, $likeKey);
	} else {
		$fieldNo = $allowedFields[$fieldRaw] ?? 'k25.F15';
		$sql = "$baseSql WHERE $baseCondition AND $fieldNo LIKE ? ORDER BY k25.F90, k25.F02, k25.F07";
		$stmt = mysqli_prepare($link, $sql);
		mysqli_stmt_bind_param($stmt, "s", $likeKey);
	}

	mysqli_stmt_execute($stmt);
	$result = mysqli_stmt_get_result($stmt);
	$total_rows = mysqli_num_rows($result);
}

// 4. 取得欄位寬度設定 (應付使用 K09)
$wthary = fldwdthpre('K09', '1', $link);

// 5. 處理資料輸出
if ($result) {
    while ($list = mysqli_fetch_assoc($result)) {
        // 計算逾期/未支付天數
        $dueDate = new DateTime($list['F25']);
        $overDays = 0;
        if ($today > $dueDate) {
            $interval = $dueDate->diff($today);
            $overDays = $interval->days;
        }

        $arr[] = [
            'rc_no' . ($wthary[0] ?? '')        => $list['F00'],
            'shipday' . ($wthary[1] ?? '')      => $list['F90'] . '-' . $list['F02'],
            'billno' . ($wthary[2] ?? '')       => $list['F15'],
            'invoiceno' . ($wthary[3] ?? '')    => $list['F07'],
            'amount' . ($wthary[4] ?? '')       => (float)$list['F12'],
            'restmoney' . ($wthary[5] ?? '')    => (float)($list['F12'] - $list['F27']),
            'objtno' . ($wthary[6] ?? '')       => $list['F03'],
            'objtname' . ($wthary[7] ?? '')     => $list['F0E'], // 廠商簡稱
            'unitedno' . ($wthary[8] ?? '')     => $list['F04'],
            'inchargeno' . ($wthary[9] ?? '')   => $list['F19'],
            'inchargename' . ($wthary[10] ?? '') => $list['F0C'],
            'shouldpayday' . ($wthary[11] ?? '') => $list['F25'],
            'over_days' . ($wthary[12] ?? '')   => $overDays,
            'paymentway' . ($wthary[13] ?? '')  => $list['F26'],
            'lastupdate' . ($wthary[14] ?? '')  => $list['F24']
        ];
    }
}

mysqli_close($link);

// 6. JSON 輸出
echo json_encode([
    'recdrow' => array_values($arr),
    'pgttl'   => $total_rows
], JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return 0;
    return substr($kw, $st + 1, $ed - $st - 1);
}
?>