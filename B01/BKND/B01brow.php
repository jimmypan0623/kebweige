<?php
ob_start();
 header("Content-Type: application/json; charset=utf-8");
 header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

$rows = 0;
$arr = array();
$rndnb = isset($_COOKIE['INT_001']) ? (int)$_COOKIE['INT_001'] : 0;
$rndnb = max(0, min($rndnb, 6));
// --- 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式為 b01.Fxx 或 a14.Fxx，防止注入非法 SQL 指令
    return preg_match('/^((b01|a14)\.)?F[0-9]{2}$/i', $field);	
}


// 統一的欄位選取 (避免兩邊寫兩次，維護麻煩)
$columns = "b01.F00, b01.F01, b01.F02, b01.F03, b01.F04, b01.F06, b01.F98, b01.F05,
            b01.F07, a14.F02 AS F0B, b11B.nTqty, b11A.F04 AS F0D, b01.F10, b01.F11, 
            b01.F41, b01.F97, b01.F28, b01.F31, b01.F39, b01.F30, b01.F38, b01.F37, 
            b01.F21, b01.F29, b01.F42, b01.F49";

$joins = "FROM `b01` 
          LEFT JOIN `a14` ON a14.F01 = b01.F07 
          LEFT JOIN (SELECT F03, SUM(F04) AS nTqty FROM b11 GROUP BY F03) AS b11B ON b11B.F03 = b01.F01 
          LEFT JOIN `b11` AS b11A ON b01.F01 = b11A.F03 AND b01.F07 = b11A.F01";

if (substr($_POST['filename'], 0, 3) == "PGE") {
    
    // 1. 分頁模式處理
    $pgeno = (int)getNeedBetween($_POST['filename'], 'E', '|');
    $rows = (int)getNeedBetween($_POST['filename'], '|', '_');
    $pagerows = (int)substr(strrchr($_POST['filename'], '_'), 1);
    
    // 計算總頁數與總筆數 (初次載入時)
    if ($rows <= 0) {		
        $resK = mysqli_query($link, "SELECT COUNT(*) as total FROM `b01` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;

    $sql = "SELECT $columns $joins ORDER BY b01.F01 LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {    
    // 2. 搜尋模式
    $parts = explode('|', $_POST['filename']);
    $fieldNo = $parts[0];
    $filterValue = trim($parts[1] ?? '');
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // --- 優化點：確保 $fieldNo 至少有 b01 前綴以策安全 ---
    // 如果傳入的是 F01，將其補為 b01.F01
    if (stripos($fieldNo, '.') === false) {
        $fieldNo = "b01." . $fieldNo;
    }

    $sql = "SELECT $columns $joins WHERE BINARY $fieldNo LIKE ? ORDER BY $fieldNo, b01.F01";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
}

// 執行並獲取結果
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$wthary = fldwdthpre('B01', '1', $link);

while ($list3 = mysqli_fetch_assoc($result)) {
    // ... 保持您原有的 $atr 陣列組合邏輯 ...
    $atr = array(
        'rc_no'.$wthary[0] => $list3['F00'],
        'stock_no'.$wthary[1] => $list3['F01'],
        'stock_nameo'.$wthary[2]=>$list3['F02'],					                     
                     'tpemng'.$wthary[3]=>$list3['F06'],  
                     'tpblng'.$wthary[4]=>$list3['F98'],
                     'eachprchs'.$wthary[5]=>$list3['F03'],
                     'eachcount'.$wthary[6]=>$list3['F04'],  	
                     'dividing'.$wthary[7]=>$list3['F05'],
					 'dptno'.$wthary[8]=>$list3['F07'],					
					 'dptname'.$wthary[9]=>$list3['F0B'],	
                     'ntqty'.$wthary[10]=>round($list3['nTqty'],$rndnb),							 
					 'dpqty'.$wthary[11]=>round($list3['F0D'],$rndnb),                    
					 'maxinv'.$wthary[12]=>$list3['F10'],
					 'minuminv'.$wthary[13]=>$list3['F11'],
					 'location'.$wthary[14]=>$list3['F41'],
					 'buildbom'.$wthary[15]=>$list3['F97'],
					 'tpeofaply'.$wthary[16]=>$list3['F39'],
					 'lotnomng'.$wthary[17]=>$list3['F30'],
					 'prchsleadtime'.$wthary[18]=>$list3['F28'],
					 'warehousereadytime'.$wthary[19]=>$list3['F31'],					 					 
					 'salescost'.$wthary[20]=>$list3['F38'],
					 'averagecost'.$wthary[21]=>$list3['F37'],
					 'remark'.$wthary[22]=>$list3['F29'],	
					 'mtrtype'.$wthary[23]=>$list3['F42'],	
					 'orignplace'.$wthary[24]=>$list3['F49'],	
        'lastupdate'.$wthary[25] => $list3['F21']
    );
    //array_push($arr, $atr);
	$arr[] = $atr;
}

mysqli_stmt_close($stmt);
mysqli_close($link);

$json_output = array('recdrow' => $arr, 'pgttl' => (int)$rows);

// 清除緩衝區防止多餘輸出破壞 JSON
if (ob_get_length()) ob_clean(); 

echo json_encode($json_output, JSON_UNESCAPED_UNICODE);

// --- 原有輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>