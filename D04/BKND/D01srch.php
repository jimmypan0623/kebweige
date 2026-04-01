<?php
/*   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT d01.F01,d01.F04,d01.F25,d01.F16,d01.F39,d01.F03,a01.F03 as F0C,d01.F08,d01.F19,d01.F13,d01.F36 FROM d01 ";	 
	 $sql3=$sql3."left outer join a01 on d01.F39=a01.F01 ";
	 if(strlen($searchRecord)==0) {	  
         $sql3=$sql3." ";		
	 }else{		  
		$sql3=$sql3."WHERE ".$fieldNo." like '%".$searchRecord."%' "   ; 
	 }
	 $sql3=$sql3."order by ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('cust_no_ISL_050'=>$list3['F01'],  		            	             
		             'cust_name_ISL_050'=>$list3['F04'],
					 'sales_no_IHL_000'=>$list3['F39'],
					 'sales_name_IHL_000'=>$list3['F0C'],
					 'crncy_type_IHL_000'=>$list3['F25'],
					  'touch_person_IHL_000'=>$list3['F08'],
					 'ship_way_IHL_000'=>$list3['F16'],
					 'pay_way_IHL_000'=>$list3['F13'],
					 'pay_men_IHL_000t'=>$list3['F36'],
					 
					 'direct_IHL_000'=>$list3['F19'],
					 'custom_fullname_IHL_000'=>$list3['F03']
					 );    
					           //'dlvr_place_IHL_000'=>$list3['F05'],               
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

  */
 
header("Content-Type: application/json; charset=utf-8"); // 標準化為 JSON 輸出
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");

// --- 輔助函式：白名單檢查欄位名 (比照 B01 標準) ---
function isValidField($field) {
    // 限制欄位格式為 d01.Fxx 或 Fxx
    return preg_match('/^((d01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 解析傳入參數 (預期格式為 "F01|關鍵字")
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$fieldNo = substr($filename, 0, 7);
$filterKey = substr(strrchr($filename, '|'), 1);
$searchRecord = trim($filterKey);

// 1. 安全檢查：檢查欄位名是否合法
if (!isValidField($fieldNo)) {
    $fieldNo = "d01.F01"; // 若非法則強制設為預設欄位 (廠商編號)
}

// 補全資料表前綴防止多表關聯時欄位模糊 (Ambiguous error)
if (stripos($fieldNo, '.') === false) {
    $fieldNo = "d01." . $fieldNo;
}

// 2. 構建 SQL 語句
$columns = "d01.F01, d01.F04, d01.F25, d01.F16, d01.F39, d01.F03, 
            a01.F03 AS F0C, d01.F08, d01.F19, d01.F13, d01.F36";

$sql = "SELECT $columns FROM d01 
        LEFT OUTER JOIN a01 ON d01.F39 = a01.F01";

// 判斷是否有搜尋關鍵字
if (strlen($searchRecord) > 0) {
    $sql .= " WHERE $fieldNo LIKE ? ";
}

$sql .= " ORDER BY $fieldNo";

// 3. 執行預處理查詢
$stmt = mysqli_prepare($link, $sql);

if (strlen($searchRecord) > 0) {
    $filterParam = "%$searchRecord%";
    mysqli_stmt_bind_param($stmt, "s", $filterParam);
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$arr = array();
while ($list3 = mysqli_fetch_assoc($result)) {
    // 輸出欄位名稱保持與前端對應
    $arr[] = array(
        'cust_no_ISL_050'         => $list3['F01'],
        'cust_name_ISL_050'       => $list3['F04'],
        'sales_no_IHL_000'        => $list3['F39'], // 採購人員編號
        'sales_name_IHL_000'      => $list3['F0C'], // 採購人員姓名
        'crncy_type_IHL_000'      => $list3['F25'],
        'touch_person_IHL_000'    => $list3['F08'],
        'ship_way_IHL_000'        => $list3['F16'],
        'pay_way_IHL_000'         => $list3['F13'],
        'pay_men_IHL_000'         => $list3['F36'], 
        'direct_IHL_000'          => $list3['F19'],
        'custom_fullname_IHL_000' => $list3['F03']
    );
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區並輸出 JSON
if (ob_get_length()) ob_clean();
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?>