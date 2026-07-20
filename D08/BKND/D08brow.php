<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$rows = 0;
$filename = $_POST['filename'] ?? '';

// 1. 進貨/出貨計畫預期結餘計算 (固定邏輯)
$sql7 = "(SELECT d04.F00, d04.F01, d04.F02, d04.F06, (d04.F03 - d04.F09 - d04.F21) AS RST 
          FROM d04 LEFT JOIN d03 ON d03.F01 = d04.F01 
          WHERE (d04.F03 - d04.F09 - d04.F21) > 0 AND d03.F04 = 'Y')
         UNION
         (SELECT c04.F00, c04.F01, c04.F02, c04.F06, (c04.F03 - c04.F09 - c04.F21) * (-1) AS RST 
          FROM c04 LEFT JOIN c03 ON c03.F01 = c04.F01 
          WHERE (c04.F03 - c04.F09 - c04.F21) > 0 AND c03.F04 = 'Y' 
          AND c04.F02 IN (
              SELECT c04.F02 FROM c04 LEFT JOIN c03 ON c03.F01 = c04.F01 
              WHERE (c04.F03 - c04.F09 - c04.F21) > 0 AND c03.F04 = 'Y'
          )) 
         ORDER BY F02, F06, RST DESC";

// 2. 判斷查詢模式
if (substr($filename, 0, 3) == "PGE") {
    $pgeno = (int)getNeedBetween($filename, 'E', '|');
    $rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);

    if ($rows <= 0) {
        $sqlCount = "SELECT COUNT(*) as total FROM d04 LEFT JOIN d03 ON d03.F01=d04.F01 
                     WHERE d04.F03 - d04.F09 - d04.F21 > 0 AND d03.F04 = 'Y'";
        $resCount = mysqli_query($link, $sqlCount);
        $rowCount = mysqli_fetch_assoc($resCount);
        $rows = (int)$rowCount['total'];
    }

    $start_rowrecord = $pagerows * ($pgeno - 1);

    $sqlMain = "SELECT `d04`.`F00`, `d04`.`F02`, `b01`.`F02` AS `F0B`, `d04`.`F01`, `d04`.`F06`, 
                (`d04`.`F03`-`d04`.`F09`-`d04`.`F21`) AS NSH, `d04`.`F23`, `d03`.`F03`, `d01`.`F04` As F0D, 
                `d04`.`F05`, `d03`.`F14`, `d03`.`F07`, `a01`.`F03` AS F0C, `d04`.`F12`, b11B.nTqty, 
                DATEDIFF(CURDATE(), `d04`.`F06`) AS diffdate FROM `d04`
                LEFT JOIN `b01` ON `b01`.`F01`=`d04`.`F02`
                LEFT JOIN `d03` ON `d03`.`F01`=`d04`.`F01`
                LEFT JOIN `d01` ON `d01`.`F01`=`d03`.`F03`
                LEFT JOIN `a01` ON `a01`.`F01`=`d03`.`F07`
                LEFT JOIN (SELECT b11.F03, SUM(b11.F04) AS nTqty FROM b11 
                           LEFT JOIN a14 ON a14.F01=b11.F01 
                           WHERE (a14.F04='Y' AND a14.F12='Y') GROUP BY b11.F03) AS b11B ON b11B.F03=d04.F02
                WHERE `d04`.`F03`-`d04`.`F09`-`d04`.`F21` > 0 AND `d03`.`F04`='Y' 
                ORDER BY `d04`.`F02`, `d04`.`F06` LIMIT ?, ?";

    $stmt = $link->prepare($sqlMain);
    $stmt->bind_param("ii", $start_rowrecord, $pagerows);

} else {
    // 搜尋模式：比照 C05 移除 preg_match 安全檢查
    $fieldNo = substr($filename, 0, 7);
    $filterKey = "%" . trim(substr(strrchr($filename, '|'), 1)) . "%";
    // 2. 安全檢查：限制欄位名稱只能包含英數字、點、底線
    if (!preg_match('/^[a-zA-Z0-9._]+$/', $fieldNo)) {
        die(json_encode(["error" => "Invalid Field Format"]));
    }
    $sqlMain = "SELECT `d04`.`F00`, `d04`.`F02`, `b01`.`F02` AS `F0B`, `d04`.`F01`, `d04`.`F06`, 
                (`d04`.`F03`-`d04`.`F09`-`d04`.`F21`) AS NSH, `d04`.`F23`, `d03`.`F03`, `d01`.`F04` As F0D, 
                `d04`.`F05`, `d03`.`F14`, `d03`.`F07`, `a01`.`F03` AS F0C, `d04`.`F12`, b11B.nTqty, 
                DATEDIFF(CURDATE(), `d04`.`F06`) AS diffdate FROM `d04`
                LEFT JOIN `b01` ON `b01`.`F01`=`d04`.`F02`
                LEFT JOIN `d03` ON `d03`.`F01`=`d04`.`F01`
                LEFT JOIN `d01` ON `d01`.`F01`=`d03`.`F03`
                LEFT JOIN `a01` ON `a01`.`F01`=`d03`.`F07`
                LEFT JOIN (SELECT b11.F03, SUM(b11.F04) AS nTqty FROM b11 
                           LEFT JOIN a14 ON a14.F01=b11.F01 
                           WHERE (a14.F04='Y' AND a14.F12='Y') GROUP BY b11.F03) AS b11B ON b11B.F03=d04.F02
                WHERE $fieldNo LIKE ? AND `d04`.`F03`-`d04`.`F09`-`d04`.`F21` > 0 AND `d03`.`F04`='Y' 
                ORDER BY $fieldNo, `d04`.`F06` ";

    $stmt = $link->prepare($sqlMain);
    $stmt->bind_param("s", $filterKey);
}

// 4. 執行並整理預計結餘
$stmt->execute();
$mainResult = $stmt->get_result();

$res8 = mysqli_query($link, $sql7);
$initleft = 0;
$initstockno = '';
$amr = array();
while ($list8 = mysqli_fetch_assoc($res8)) {
    if ($list8['F02'] != $initstockno) {
        $initleft = 0;
    }
    $initleft += $list8['RST'];
    $amr[substr($list8['F01'], 0, 2) . $list8['F00']] = $initleft;
    $initstockno = $list8['F02'];
}

// 5. 輸出回傳
$wthary = fldwdthpre('D08', '1', $link); // 改回 D08 的寬度設定檔
$arr = array();
while ($list3 = $mainResult->fetch_assoc()) {
    $key = substr($list3['F01'], 0, 2) . $list3['F00'];
    $avl_qty = (isset($amr[$key]) ? $amr[$key] : 0) + ($list3['nTqty'] ?? 0);
    $mapping = [
        $list3['F00'],
        $list3['F02'],
        $list3['F0B'],
        $list3['F01'],
        $list3['F06'],
        $list3['NSH'],
        $list3['F23'],
        $avl_qty,
        $list3['nTqty'],
        $list3['F03'],
        $list3['F0D'],
        $list3['F05'],
        $list3['F14'],
        $list3['F07'],
        $list3['F0C'],
        $list3['diffdate'],
        $list3['F12']
    ];
	$atr = [];
	$i = 0;
	foreach ($mapping as  $db_col) { 
		$atr[$wthary[$i]] = $db_col ?? '';
		$i++;
	}
	$arr[] = $atr;			
}

$stmt->close();
mysqli_close($link);
echo json_encode(array('recdrow' => $arr, 'pgttl' => $rows));

// 輔助函式
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>