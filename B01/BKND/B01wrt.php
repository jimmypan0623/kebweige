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

$trnarray = fldafterwrite('B01', '1', $link, true);  	

    
        $lastdate = date('Y-m-d');
        $mArlth = count($brr);
        $flag = $brr[$mArlth - 2]; // 旗標 (0代表新增，其他數字代表 PK ID)

        if ($flag == 0) { // 新增						  		
            $sql = "SELECT * FROM b01 WHERE F01='" . $brr[0] . "'"; 
            $sql2 = mysqli_query($link, $sql);
            $rows = @mysqli_num_rows($sql2);

            if ($rows > 0) {			 
                echo json_encode("資料庫已有此料號"); 
            } else if (empty($brr[0])) {
                echo json_encode("資料空值"); 
            } else {	  
                // 以下處理 MySQL 記錄新增  
                $mscnt = "INSERT INTO b01(F01,F02,F06,F98,F03,F04,F05,F07,F10,F11,F41,F97,F39,F30,F28,F31,F38,F37,F29,F42,F49,F21) VALUES (";	    
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
                $mscnt .= "'" . $brr[12] . "',";	 
                $mscnt .= "'" . $brr[13] . "',";	 
                $mscnt .= "'" . $brr[14] . "',";	
                $mscnt .= "'" . $brr[15] . "',";	  
                $mscnt .= "'" . $brr[16] . "',";	 
                $mscnt .= "'" . $brr[17] . "',";	 
                $mscnt .= "'" . $brr[18] . "',";	      
                $mscnt .= "'" . $brr[19] . "',";		
                $mscnt .= "'" . $brr[20] . "',";					  
                $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";		      

                $sql = $mscnt;                                               
                mysqli_query($link, $sql) or die(mysqli_error($link));  
                $last_id = mysqli_insert_id($link); 				 
                $arr = array('order_no' => $last_id, 'dpt_name' => $brr[21], 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);
                echo json_encode($arr);
            }	   			 
        } else { // 修改
            $mscnt = "UPDATE b01 SET ";
            $mscnt .= "F02='" . $brr[1] . "',";	    
            $mscnt .= "F06='" . $brr[2] . "',";
            $mscnt .= "F98='" . $brr[3] . "',";
            $mscnt .= "F03='" . $brr[4] . "',";	 
            $mscnt .= "F04='" . $brr[5] . "',";	
            $mscnt .= "F05='" . $brr[6] . "',";	
            $mscnt .= "F07='" . $brr[7] . "',";
            $mscnt .= "F10='" . $brr[8] . "',";	 
            $mscnt .= "F11='" . $brr[9] . "',";	
            $mscnt .= "F41='" . $brr[10] . "',";	
            $mscnt .= "F97='" . $brr[11] . "',";  	
            $mscnt .= "F39='" . $brr[12] . "',";	
            $mscnt .= "F30='" . $brr[13] . "',";			  
            $mscnt .= "F28='" . $brr[14] . "',";		
            $mscnt .= "F31='" . $brr[15] . "',";	 	  
            $mscnt .= "F38='" . $brr[16] . "',";	
            $mscnt .= "F37='" . $brr[17] . "',";		
            $mscnt .= "F29='" . $brr[18] . "',";			 
            $mscnt .= "F42='" . $brr[19] . "',";	
            $mscnt .= "F49='" . $brr[20] . "',";	
            $mscnt .= "F21='" . $lastdate . $_SESSION['user_name'] . "'";
            $mscnt .= " WHERE F00='" . $flag . "'";

            $sql = $mscnt;                                                 
            mysqli_query($link, $sql) or die(mysqli_error($link));  		  
            $arr = array('order_no' => $flag, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);
            echo json_encode($arr);
        }  
    

mysqli_close($link);	
?>