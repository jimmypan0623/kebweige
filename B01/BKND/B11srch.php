<?php
header("Content-Type: application/json; charset=utf-8"); // 改為 JSON 格式標頭
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";
// 1. 安全地處理參數
$rndnb = isset($_COOKIE['INT_001']) ? (int)$_COOKIE['INT_001'] : 0;
$searchRecord = isset($_POST['filename']) ? $_POST['filename'] : '';

// 2. 使用預處理語句 (防止 SQL 注入)
$sql = "SELECT b11.F01, a14.F02, a14.F12, b11.F03, b11.F04, b11.F05, b11.F06, 
               DATEDIFF(CURDATE(), b11.F05) as Inactive_days
        FROM b11 
        LEFT OUTER JOIN a14 ON a14.F01 = b11.F01 
        WHERE b11.F04 != 0 AND b11.F03 = ? 
        ORDER BY b11.F01 DESC";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "s", $searchRecord); // "s" 代表字串
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$arr = array();
if ($result) {
	$wthary = fldwdthpre('B01', 'A', $link);
    while ($list3 = mysqli_fetch_assoc($result)) {        
		$mapping =[          
			$list3['F01'],    //部門編號
            $list3['F02'],    //部門名稱
            $list3['F12'],    //列入計算
            round((float)$list3['F04'], $rndnb), // 庫存數量,確保為浮點數後再四捨五入  
            $list3['F05'],    //最後異動
            $list3['F06'],    //預計用途
            $list3['Inactive_days']   //呆滯天數
        ];  
		$atr = [];
		$i = 0;
		foreach ($mapping as  $db_col) { 
			$atr[$wthary[$i]] = $db_col ?? '';
			$i++;
		}
		$arr[] = $atr;		
    }
}

// 3. 關閉連線並輸出
mysqli_close($link);
echo json_encode($arr);
?>