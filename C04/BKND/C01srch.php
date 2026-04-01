<?php
/*   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT c01.F01,c01.F05,c01.F07,c01.F39,c01.F32,c01.F33,c01.F04,a01.F03 as F0C,c01.F12,c01.F31,c01.F15,c01.F36 FROM c01 ";	 
	 $sql3=$sql3."left outer join a01 on c01.F33=a01.F01 ";
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
		             'cust_name_ISL_050'=>$list3['F05'],
					 'sales_no_IHL_000'=>$list3['F33'],
					 'sales_name_IHL_000'=>$list3['F0C'],
					 'crncy_type_IHL_000'=>$list3['F39'],
					  'touch_person_IHL_000'=>$list3['F12'],
					 'ship_way_IHL_000'=>$list3['F31'],
					 'pay_way_IHL_000'=>$list3['F15'],
					 'pay_men_IHL_000t'=>$list3['F36'],
					 'dlvr_place_IHL_000'=>$list3['F07'],
					 'direct_IHL_000'=>$list3['F32'],
					 'custom_fullname_IHL_000'=>$list3['F04']
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

  */
  
header("Content-Type: application/json; charset=utf-8"); // 修正為 json 格式
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");

// --- 輔助函式：白名單檢查欄位名 ---
function isValidField($field) {
    // 限制欄位格式為 c01.Fxx 或 Fxx
    return preg_match('/^((c01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 解析傳入參數 (預期格式為 "F01|關鍵字")
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$fieldNo = substr($filename, 0, 7);
$filterKey = substr(strrchr($filename, '|'), 1);
$searchRecord = trim($filterKey);

// 1. 安全檢查：檢查欄位名是否合法
if (!isValidField($fieldNo)) {
    $fieldNo = "c01.F01"; // 若非法則強制設為預設欄位
}

// 補全資料表前綴防止 Ambiguous error
if (stripos($fieldNo, '.') === false) {
    $fieldNo = "c01." . $fieldNo;
}

// 2. 構建 SQL 語句
$columns = "c01.F01, c01.F05, c01.F07, c01.F39, c01.F32, c01.F33, c01.F04, 
            a01.F03 as F0C, c01.F12, c01.F31, c01.F15, c01.F36";

$sql = "SELECT $columns FROM c01 
        LEFT OUTER JOIN a01 ON c01.F33 = a01.F01";

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
    $arr[] = array(
        'cust_no_ISL_050'         => $list3['F01'],
        'cust_name_ISL_050'       => $list3['F05'],
        'sales_no_IHL_000'        => $list3['F33'],
        'sales_name_IHL_000'      => $list3['F0C'],
        'crncy_type_IHL_000'      => $list3['F39'],
        'touch_person_IHL_000'    => $list3['F12'],
        'ship_way_IHL_000'        => $list3['F31'],
        'pay_way_IHL_000'         => $list3['F15'],
        'pay_men_IHL_000'         => $list3['F36'], // 修正原程式碼變數名拼錯 pay_men_IHL_000t
        'dlvr_place_IHL_000'      => $list3['F07'],
        'direct_IHL_000'          => $list3['F32'],
        'custom_fullname_IHL_000' => $list3['F04']
    );
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 清除緩衝區並輸出 JSON
if (ob_get_length()) ob_clean();
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?>