<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8"); // 建議回傳 JSON 時正確設定 Header
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 取得並過濾基本參數
$sq20="select * from a26 where F01='INT_069' "; 
$sql7=@mysqli_query($link,$sq20);                           
$list8=mysqli_fetch_assoc($sql7);  //紀錄參數  	    
$rnddgt = isset($list8['F06']) ? intval($list8['F06']) : 0;

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
	 $mapping=[$list3['F00'],$list3['F03'],$list3['F04'],$list3['F01'],$list3['F05'],$list3['F02'],
       $list3['F0E'],$list3['F08'],$list3['F07'],$list3['F06'],$list3['F09'],
	   round($list3['F08'] * $list3['F07'] * $list3['F09'], $rnddgt),$list3['F15'],$list3['F0D'],$list3['F10'],
	   $list3['F0C'],$list3['F14'],$list3['F0B'],$list3['F16'],$list3['F17'],$list3['F19']];
    $atr = [];
	$i = 0;
	foreach ($mapping as  $db_col) { 
		$atr[$wthary[$i]] = $db_col ?? '';
		$i++;
	}
	$arr[] = $atr;			
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