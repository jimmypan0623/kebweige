<?php
 /* header("Content-Type: application/json; charset=utf-8"); // 修正為 application/json
 include("../../include/BKND/mysqli_server.php");          //引用檔   
        $str=explode(',',$_POST['filename']);  //將上面字串以逗號分割成陣列		 
		 $customno=trim($str[2]);
	  $searchRecord =trim($str[1]);		
	  $sql0="select F44 from c01 where F01='".$customno."'"; 
     $sql1=@mysqli_query($link,$sql0);                      
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前客戶之群組編號
	 $sql3="SELECT b01.F01,b01.F02,b01.F04,b01.F28,b01.F31,b01.F05,c02A.F13,c02A.F08,c02A.F04 as F0D,c02A.F07,c02A.F15,c20.F03 AS F0C,c20.F15 AS F1E FROM b01 ";	 	
	 $sql3.="left outer join (select F01,F02,F03,F04,F06,F07,F08,F13,F15 from c02 where F06='".$str[3]."' AND F01='".$list4['F44']."' AND (CURDATE() BETWEEN F02 AND F15) order by F15 ) as c02A on c02A.F03=b01.F01  ";	
	 $sql3.="LEFT OUTER JOIN c20 ON c20.F01=b01.F01 ";
	if(strlen($searchRecord)==0) {	  
         $sql3=$sql3."WHERE RIGHT(F98,1)='Y' OR F98='NNN' ";		
	 }else{
		$sql3=$sql3."WHERE ".$str[0]." like '%".$searchRecord."%' AND (RIGHT(F98,1)='Y' OR F98='NNN') "   ; 
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
					 'basic_qty_IHR_000'=>($list3['F13']>0?$list3['F13']:$list3['F0C']),
					 'minum_qty_ISR_010'=>($list3['F08']>0?$list3['F08']:$list3['F1E']),					 
					 'custom_part_ISL_018'=>$list3['F0D'],	
					 'invalid_date_ISC_011'=>$list3['F15'],
					 'order_price_ISR_010'=>($list3['F07']>0?$list3['F07']:$list3['F05']),
					 'leadtime_IHL_000'=>($list3['F28']+$list3['F31'])
					 );    					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	   
		  */
		 
		 
		 //////

header("Content-Type: application/json; charset=utf-8"); // 修正為 application/json

// 1. 資料庫連線資訊 (建議將這些放入 config.php 並 include)
$db_host = 'localhost';
$db_name = 'tkdata';
$db_user = 'root';
$db_pass = 'To6035376615004513834';

try {
    // 建立 PDO 連線並設定錯誤模式
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // 2. 解析傳入參數
    if (!isset($_POST['filename'])) {
        echo json_encode([]);
        exit;
    }

    $str = explode(',', $_POST['filename']);
    $field_name   = $str[0]; // 注意：欄位名稱不能直接綁定參數，需做白名單過濾
    $searchRecord = trim($str[1] ?? '');
    $customno     = trim($str[2] ?? '');
    $currency     = trim($str[3] ?? '');

    // 3. 第一步：取得客戶的群組編號 (F44)
    $stmt0 = $pdo->prepare("SELECT F44 FROM c01 WHERE F01 = ?");
    $stmt0->execute([$customno]);
    $list4 = $stmt0->fetch();
    $group_no = $list4 ? $list4['F44'] : '';

    // 4. 第二步：建構主查詢
    // 注意：$field_name 是欄位名，PDO 不支援參數化欄位名，故需限制可搜尋的範圍
    $allowed_fields = ['b01.F01', 'b01.F02', 'c04.F05']; // 根據您的 searchOptionsKey 定義
    if (!in_array($field_name, $allowed_fields)) {
        $field_name = 'b01.F01'; // 預設安全欄位
    }

    $sql = "SELECT b01.F01, b01.F02, b01.F04, b01.F28, b01.F31, b01.F05, 
                   c02A.F13, c02A.F08, c02A.F04 as F0D, c02A.F07, c02A.F15, 
                   c20.F03 AS F0C, c20.F15 AS F1E 
            FROM b01 
            LEFT OUTER JOIN (
                SELECT F01, F02, F03, F04, F06, F07, F08, F13, F15 
                FROM c02 
                WHERE F06 = :currency 
                  AND F01 = :group_no 
                  AND (CURDATE() BETWEEN F02 AND F15)
            ) AS c02A ON c02A.F03 = b01.F01 
            LEFT OUTER JOIN c20 ON c20.F01 = b01.F01 ";

    // 判斷搜尋條件
    if (empty($searchRecord)) {
        $sql .= "WHERE RIGHT(F98, 1) = 'Y' OR F98 = 'NNN' ";
    } else {
        $sql .= "WHERE $field_name LIKE :search AND (RIGHT(F98, 1) = 'Y' OR F98 = 'NNN') ";
    }
    
    $sql .= "ORDER BY $field_name";

    $stmt = $pdo->prepare($sql);
    
    // 綁定參數
    $stmt->bindValue(':currency', $currency);
    $stmt->bindValue(':group_no', $group_no);
    if (!empty($searchRecord)) {
        $stmt->bindValue(':search', "%$searchRecord%");
    }

    $stmt->execute();

    // 5. 第三步：封裝結果
    $arr = [];
    $itemno = 0;
    while ($list3 = $stmt->fetch()) {
        $itemno++;
        $arr[] = [
            'item_no_IHC_000'      => $itemno,
            'stock_no_ISL_026'     => $list3['F01'],
            'stock_name_ISL_020'   => $list3['F02'],
            'unit_name_IHL_000'    => $list3['F04'],
            'basic_qty_IHR_000'    => ($list3['F13'] > 0 ? $list3['F13'] : $list3['F0C']),
            'minum_qty_ISR_010'    => ($list3['F08'] > 0 ? $list3['F08'] : $list3['F1E']),
            'custom_part_ISL_018'  => $list3['F0D'],
            'invalid_date_ISC_011' => $list3['F15'],
            'order_price_ISR_010'  => ($list3['F07'] > 0 ? $list3['F07'] : $list3['F05']),
            'leadtime_IHL_000'     => ($list3['F28'] + $list3['F31'])
        ];
    }

    echo json_encode($arr);

} catch (PDOException $e) {
    // 實際環境中應寫入 Log，不直接噴出錯誤
    http_response_code(500);
    echo json_encode(["error" => "Database Error"]);
}
	 
?>  