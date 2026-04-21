<?php
header("Content-Type: application/json; charset=utf-8"); // 建議回傳 JSON 時正確設定 Header
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 取得並過濾基本參數
$rnddgt = isset($_COOKIE["INT_069"]) ? intval($_COOKIE["INT_069"]) : 0;
$filename = $_POST['filename'] ?? '';

// 2. 判斷邏輯並提取變數
if (substr($filename, 0, 3) == "PGE") {
    $pgeno = getNeedBetween($filename, 'E', '|');
    
    // SQL 樣板 (使用 ? 代替變數)
    $sql3 = "SELECT c10.*, c01.F05 AS F0E, a0A.F03 AS F0C, a0B.F03 AS F0B, a14.F02 AS F0D FROM c10 
             LEFT OUTER JOIN c01 ON c01.F01=c10.F02
             LEFT OUTER JOIN `a01` AS a0A ON c10.F10 = a0A.F01 
             LEFT OUTER JOIN `a01` AS a0B ON c10.F14 = a0B.F01
             LEFT OUTER JOIN `a14` ON a14.F01=c10.F15
             WHERE c10.F90 = ? ORDER BY c10.F01, c10.F03";

    $stmt = $link->prepare($sql3);
    $stmt->bind_param("s", $pgeno); // "s" 代表字串 (string)
} else {
    $fieldNo = substr($filename, 0, 7);
    $filterKey = "%" . trim(getNeedBetween($filename, '|', '_')) . "%";
    $pgeno = substr(strrchr($filename, '_'), 1);

    // 注意：欄位名稱 ($fieldNo) 不能使用 bind_param，必須先做白名單過濾
    // 假設合法欄位開頭必須是 F
    if (!preg_match('/^[a-zA-Z0-9._]+$/', $fieldNo)) {
        die(json_encode(["error" => "Invalid field name"]));
    }

    $sql3 = "SELECT c10.*, c01.F05 AS F0E, a0A.F03 AS F0C, a0B.F03 AS F0B, a14.F02 AS F0D FROM c10 
             LEFT OUTER JOIN c01 ON c01.F01=c10.F02
             LEFT OUTER JOIN `a01` AS a0A ON c10.F10 = a0A.F01 
             LEFT OUTER JOIN `a01` AS a0B ON c10.F14 = a0B.F01
             LEFT OUTER JOIN `a14` ON a14.F01=c10.F15
             WHERE c10.F90 = ? AND $fieldNo LIKE ? 
             ORDER BY $fieldNo ASC, c10.F01 DESC";

    $stmt = $link->prepare($sql3);
    $stmt->bind_param("ss", $pgeno, $filterKey);
}

// 3. 執行查詢並取得結果
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

// 5. 處理報表欄位寬度與資料格式化
$wthary = fldwdthpre('C10', '1', $link);
$arr = array();

while ($list3 = $result3->fetch_assoc()) {
    $atr = array(
        'rc_no' . $wthary[0] => $list3['F00'],
        'stock_no' . $wthary[1] => $list3['F03'],
        'bill_no' . $wthary[2] => $list3['F04'],
        'ship_date' . $wthary[3] => $list3['F01'],
        'recipt_no' . $wthary[4] => $list3['F05'],
        'custom_no' . $wthary[5] => $list3['F02'],
        'custom_name' . $wthary[6] => $list3['F0E'],
        'ship_qty' . $wthary[7] => $list3['F08'],
        'unit_price' . $wthary[8] => $list3['F07'],
        'crncy_type' . $wthary[9] => $list3['F06'],
        'crncy_rate' . $wthary[10] => $list3['F09'],
        'rcd_total' . $wthary[11] => round($list3['F08'] * $list3['F07'] * $list3['F09'], $rnddgt),
        'depart_no' . $wthary[12] => $list3['F15'],
        'depart_name' . $wthary[13] => $list3['F0D'],
        'sales_no' . $wthary[14] => $list3['F10'],
        'sales_name' . $wthary[15] => $list3['F0C'],
        'assist_no' . $wthary[16] => $list3['F14'],
        'assist_name' . $wthary[17] => $list3['F0B'],
        'custom_po' . $wthary[18] => $list3['F16'],
        'custom_partno' . $wthary[19] => $list3['F17'],
        'lastupdate' . $wthary[20] => $list3['F19']
    );
    array_push($arr, $atr);
}

// 6. 關閉連線並輸出
$stmt->close();
$stmt0->close();
mysqli_close($link);

echo json_encode(array('recdrow' => $arr, 'transcode' => $transcode));

// 輔助函式
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>