<?php
require_once("../../include/BKND/auth_check.php"); // 驗證
$str_json = file_get_contents('php://input'); 
$response = json_decode($str_json, true); // 【修正 1】改為一次性 JSON 解碼為陣列

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

$trnarray = fldafterwrite('A20', '1', $link, true);       

   
        $lastdate = date('Y-m-d');
        $mArlth = count($brr);  
        $flag = $brr[$mArlth - 2]; // 旗標 (0代表新增，其他數字代表 PK ID)

        if ($flag == 0) { // 新增						   
            $sql = "SELECT * FROM a20 WHERE F01='" . trim($brr[0]) . "'"; 
            $sql2 = mysqli_query($link, $sql);
            $rows = @mysqli_num_rows($sql2);

            if ($rows > 0) {			 
                echo json_encode("資料庫已有此編號"); 
            } else {
                // 以下處理 MySQL 記錄新增  	        
                $mscnt = "INSERT INTO a20(F01, F07, F02, F03, F13) VALUES (";	 			   
                $mscnt .= "'" . $brr[0] . "',";
                $mscnt .= "'" . $brr[1] . "',";
                $mscnt .= "'" . $brr[2] . "',";	 
                $mscnt .= "'" . $brr[3] . "',";	 			   
                $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";		      

                $sql = $mscnt;                                               
                mysqli_query($link, $sql) or die(mysqli_error($link));  
                $last_id = mysqli_insert_id($link); 				     
                $arr = array('order_no' => $last_id, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);						 
                echo json_encode($arr);
            }   	     
        } else { // 修改
            $mscnt = "UPDATE a20 SET ";
            $mscnt .= "F07='" . $brr[1] . "',";	    
            $mscnt .= "F02='" . $brr[2] . "',";	   
            $mscnt .= "F03='" . $brr[3] . "',";	 
            $mscnt .= "F13='" . $lastdate . $_SESSION['user_name'] . "'";
            $mscnt .= " WHERE F00='" . $flag . "'";

            $sql = $mscnt;                                                 
            mysqli_query($link, $sql) or die(mysqli_error($link));  	  
            $arr = array('order_no' => $flag, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);
            echo json_encode($arr);
        }  
    

mysqli_close($link);	
?>