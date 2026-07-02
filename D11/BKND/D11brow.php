<?php
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 取得並處理基礎參數
$rnddgt = isset($_COOKIE["INT_069"]) ? intval($_COOKIE["INT_069"]) : 0;
$filename = $_POST['filename'] ?? '';

// 2. 初始化 SQL 邏輯
if (substr($filename, 0, 3) == "PGE") {
    $pgeno = getNeedBetween($filename, 'E', '|');
    
    $sql3 = "SELECT d11.*, d01.F04 AS F0E, a01.F03 AS F0C, a14.F02 AS F0D FROM d11 
             LEFT OUTER JOIN d01 ON d01.F01 = d11.F02
             LEFT OUTER JOIN a01 ON a01.F01 = d11.F10 
             LEFT OUTER JOIN a14 ON a14.F01 = d11.F15
             WHERE d11.F90 = ? ORDER BY d11.F01, d11.F03";

    $stmt = $link->prepare($sql3);
    $stmt->bind_param("s", $pgeno);
} else {
    $fieldNo = substr($filename, 0, 7);
    $filterKey = "%" . trim(getNeedBetween($filename, '|', '_')) . "%";
    $pgeno = substr(strrchr($filename, '_'), 1);

    // 針對欄位名稱進行白名單檢查 (防止 SQL 注入)
    if (!preg_match('/^[a-zA-Z0-9._]+$/', $fieldNo)) {
        die(json_encode(["error" => "Invalid Field"]));
    }

    $sql3 = "SELECT d11.*, d01.F04 AS F0E, a01.F03 AS F0C, a14.F02 AS F0D FROM d11 
             LEFT OUTER JOIN d01 ON d01.F01 = d11.F02
             LEFT OUTER JOIN a01 ON a01.F01 = d11.F10 
             LEFT OUTER JOIN a14 ON a14.F01 = d11.F15
             WHERE d11.F90 = ? AND $fieldNo LIKE ? 
             ORDER BY $fieldNo ASC, d11.F01 DESC";

    $stmt = $link->prepare($sql3);
    $stmt->bind_param("ss", $pgeno, $filterKey);
}

// 3. 執行報表查詢
$stmt->execute();
$result3 = $stmt->get_result();

// 4. 查詢結轉狀態 (a23 表)
$sql0 = "SELECT F07 FROM a23 WHERE F01 = ?";
$stmt0 = $link->prepare($sql0);
$stmt0->bind_param("s", $pgeno);
$stmt0->execute();
$res0 = $stmt0->get_result();
$list4 = $res0->fetch_assoc();
$transcode = $list4['F07'] ?? '';

// 5. 格式化輸出資料
$wthary = fldwdthpre('D11', '1', $link);
$arr = array();

while ($list3 = $result3->fetch_assoc()) {
	   
    $mapping = [
        $list3['F00'],
        $list3['F03'],
        $list3['F04'],
        $list3['F01'],
        $list3['F05'],
        $list3['F02'],
        $list3['F0E'],
        $list3['F08'],
        $list3['F07'],
        $list3['F06'],
        $list3['F09'],
        round($list3['F08'] * $list3['F07'] * $list3['F09'], $rnddgt),
        $list3['F15'],
        $list3['F0D'],
         $list3['F10'],
        $list3['F0C'],
        $list3['F16'],
        $list3['F17'],
        $list3['F19']
    ];
	$atr = [];
	$i = 0;
	foreach ($mapping as $db_col) {		
		$atr[$wthary[$i]] = $db_col ?? '';
		$i++;
	}
	$arr[] = $atr;			 
    
}

// 6. 釋放資源並輸出
$stmt->close();
$stmt0->close();
mysqli_close($link);

echo json_encode(array('recdrow' => $arr, 'transcode' => $transcode));

// 輔助函式：提取字串
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>