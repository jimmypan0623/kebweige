<?php
require_once("../../include/BKND/auth_check.php"); // 驗證
$str_json = file_get_contents('php://input'); 
$response = json_decode($str_json, true); // 【修正 1】改為單次 JSON 解碼為陣列

if ($response === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($response as $key => $val) {	   
    $brr[] = addslashes($val); // 避免單引號跳脫問題
}

require_once("../../include/BKND/mysqli_server.php"); 
require_once "../../include/BKND/fieldDOMset.php"; 

$trnarray = fldafterwrite('B01', '2', $link, true);  

// 檢查料品是否存在
$sql5 = "SELECT * FROM c01 WHERE F01='" . $brr[1] . "'"; 
$sql6 = mysqli_query($link, $sql5) or die(mysqli_error($link));
$rows2 = @mysqli_num_rows($sql6);

if ($rows2 == 0) {
    echo json_encode("料品編號錯誤"); 
    exit;
}

        $lastdate = date('Y-m-d');	 
        $mArlth = count($brr);  
        $flag = $brr[$mArlth - 2]; // 旗標 (0代表新增，其他數字代表 PK ID)

        if ($flag == 0) { // 新增						   	    			 
            // 以下處理 MySQL 記錄新增  	        
            $mscnt = "INSERT INTO c02(F03,F01,F04,F06,F07,F13,F08,F10,F11,F02,F15,F16,F99) VALUES (";	 			   
            $mscnt .= "'" . $brr[0] . "',";
            $mscnt .= "'" . $brr[1] . "',";
            $mscnt .= "'" . $brr[2] . "',";	 
            $mscnt .= "'" . $brr[3] . "',";	
            $mscnt .= "'" . $brr[4] . "',"; 		
            $mscnt .= "'" . $brr[5] . "',"; 	
            $mscnt .= "'" . $brr[6] . "',";	
            $mscnt .= "'" . $brr[7] . "',"; 		
            $mscnt .= "'" . $brr[8] . "',"; 		
            $mscnt .= "'" . $brr[9] . "',"; 	
            $mscnt .= "'" . $brr[10] . "',"; 		
            $mscnt .= "'" . $brr[11] . "',"; 	
            $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";		      

            $sql = $mscnt;                                               
            mysqli_query($link, $sql) or die(mysqli_error($link));  
            $last_id = mysqli_insert_id($link); 				     
            $arr = array('order_no' => $last_id, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);						 
            echo json_encode($arr);
        } else { // 修改
            $mscnt = "UPDATE c02 SET ";
            $mscnt .= "F04='" . $brr[2] . "',";	    
            $mscnt .= "F06='" . $brr[3] . "',";	   
            $mscnt .= "F07='" . $brr[4] . "',";	 
            $mscnt .= "F13='" . $brr[5] . "',";	 
            $mscnt .= "F08='" . $brr[6] . "',";	
            $mscnt .= "F10='" . $brr[7] . "',";	
            $mscnt .= "F11='" . $brr[8] . "',";	
            $mscnt .= "F02='" . $brr[9] . "',";		  
            $mscnt .= "F15='" . $brr[10] . "',";	   	   
            $mscnt .= "F16='" . $brr[11] . "',";	
            $mscnt .= "F99='" . $lastdate . $_SESSION['user_name'] . "'";
            $mscnt .= " WHERE F00='" . $flag . "'";

            $sql = $mscnt;                                                 
            mysqli_query($link, $sql) or die(mysqli_error($link));  	  
            $arr = array('order_no' => $flag, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);
            echo json_encode($arr);
        }  
    

mysqli_close($link);	
?>