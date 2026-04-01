<?php
/* header("Content-Type:text/html; charset=utf-8");   
 include("../../include/BKND/mysqli_server.php");          //引用檔   
        $str=explode(',',$_POST['filename']);  //將上面字串以逗號分割成陣列		 
		 $customno=trim($str[2]);
	  $searchRecord =trim($str[1]);		
	  
	 $sql3="SELECT b01.F01,b01.F02,b01.F04,b01.F28,b01.F31,b01.F38,d02A.F13,d02A.F08,d02A.F04 as F0D,d02A.F07,d02A.F15,c20.F03 AS F0C,c20.F15 AS F1E FROM b01 ";	 	
	 $sql3.="left outer join (select F01,F02,F03,F04,F06,F07,F08,F13,F15 from d02 where F06='".$str[3]."' AND F01='".$customno."' AND (CURDATE() BETWEEN F02 AND F15) order by F15 ) as d02A on d02A.F03=b01.F01  ";	
	  $sql3.="LEFT OUTER JOIN c20 ON c20.F01=b01.F01 ";
	 if(strlen($searchRecord)==0) {	  
         $sql3=$sql3."WHERE LEFT(F98,1)='Y' OR F98='NNN' ";		
	 }else{

		$sql3=$sql3."WHERE ".$str[0]." like '%".$searchRecord."%' AND (LEFT(F98,1)='Y' OR F98='NNN') "   ; 
	 }
	 $sql3=$sql3."order by ".$str[0];
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$itemno=0;
	while ($list3=mysqli_fetch_assoc($sql4)){
		$itemno++; 
		$atr = array('item_no_IHC_000'=>$itemno,
		             'stock_no_ISL_026'=>$list3['F01'],  		            	             
		             'stock_name_ISL_020'=>$list3['F02'],
					 'unit_name_IHL_000'=>$list3['F04'],
					 'basic_qty_IHL_000'=>($list3['F13']>0?$list3['F13']:$list3['F0C']),
					 'minum_qty_ISR_010'=>($list3['F08']>0?$list3['F08']:$list3['F1E']),	
					 'custom_part_ISL_018'=>$list3['F0D'],	
					 'invalid_date_ISC_011'=>$list3['F15'],
					 'order_price_ISR_010'=>($list3['F07']>0?$list3['F07']:$list3['F38']),
					 'leadtime_IHL_000'=>($list3['F28']+$list3['F31'])
					 );    					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	   
?>  

  */
  
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");

// --- 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式，防止 SQL 注入
    return preg_match('/^((b01|d02|c20)\.)?F[0-9]{2}$/i', $field);
}

// 取得傳入參數
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$str = explode(',', $filename);

// 基本檢查：確保參數完整 (搜尋欄位, 關鍵字, 廠商編號, 類別代碼)
if (count($str) < 4) {
    echo json_encode(array());
    exit;
}

$searchField  = trim($str[0]); 
$searchRecord = trim($str[1]); 
$vendorNo     = trim($str[2]); // 廠商編號 (d02.F01)
$categoryCode = trim($str[3]); // 類別碼 (d02.F06)
$filterKey    = "%$searchRecord%";

// 1. 安全檢查：欄位名白名單
if (!isValidField($searchField)) {
    $searchField = "F01"; 
}

// 補全資料表前綴防止 Ambiguous error
$dbField = (stripos($searchField, '.') === false) ? "b01." . $searchField : $searchField;

// 2. 構建 SQL 語句
$columns = "b01.F01, b01.F02, b01.F04, b01.F28, b01.F31, b01.F38, 
            d02A.F13, d02A.F08, d02A.F04 AS F0D, d02A.F07, d02A.F15, 
            c20.F03 AS F0C, c20.F15 AS F1E";

// 子查詢 d02 (廠商特價檔) 與 JOIN 邏輯
$joins = "FROM b01 
          LEFT OUTER JOIN (
              SELECT F01, F02, F03, F04, F06, F07, F08, F13, F15 
              FROM d02 
              WHERE F06 = ? AND F01 = ? AND (CURDATE() BETWEEN F02 AND F15)
          ) AS d02A ON d02A.F03 = b01.F01  
          LEFT OUTER JOIN c20 ON c20.F01 = b01.F01";

// 組合條件
$where = " WHERE (LEFT(b01.F98, 1) = 'Y' OR b01.F98 = 'NNN')";
if (strlen($searchRecord) > 0) {
    $where .= " AND $dbField LIKE ?";
}

$sqlFinal = "SELECT $columns $joins $where ORDER BY $dbField";

// 3. 執行預處理查詢
$stmt = mysqli_prepare($link, $sqlFinal);

if (strlen($searchRecord) > 0) {
    // 參數順序：子查詢(categoryCode, vendorNo) + WHERE(filterKey)
    mysqli_stmt_bind_param($stmt, "sss", $categoryCode, $vendorNo, $filterKey);
} else {
    // 參數順序：子查詢(categoryCode, vendorNo)
    mysqli_stmt_bind_param($stmt, "ss", $categoryCode, $vendorNo);
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$arr = array();
$itemno = 0;

while ($list3 = mysqli_fetch_assoc($result)) {
    $itemno++;
    $arr[] = array(
        'item_no_IHC_000'      => $itemno,
        'stock_no_ISL_026'     => $list3['F01'],
        'stock_name_ISL_020'   => $list3['F02'],
        'unit_name_IHL_000'    => $list3['F04'],
        // 採購單邏輯：優先取廠商特價檔(d02A)，若無則取 c20 或基本檔 b01
        'basic_qty_IHL_000'    => ($list3['F13'] > 0 ? $list3['F13'] : $list3['F0C']),
        'minum_qty_ISR_010'    => ($list3['F08'] > 0 ? $list3['F08'] : $list3['F1E']),
        'custom_part_ISL_018'  => $list3['F0D'],
        'invalid_date_ISC_011' => $list3['F15'],
        // 採購單價格邏輯：d02 特價優先，否則取 b01.F38 (採購成本)
        'order_price_ISR_010'  => ($list3['F07'] > 0 ? $list3['F07'] : $list3['F38']),
        'leadtime_IHL_000'     => ((int)$list3['F28'] + (int)$list3['F31'])
    );
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區並輸出 JSON
if (ob_get_length()) ob_clean(); 
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?>