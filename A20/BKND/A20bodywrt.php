<?php
require_once("../../include/BKND/auth_check.php"); // 驗證
$str_json = file_get_contents('php://input'); 
$response = json_decode($str_json, true); // 【修正 1】單次解碼為陣列

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

$trnarray = fldafterwrite('A20', '2', $link, true);    
$sql0 = "SELECT * FROM a01 WHERE F01='" . $_SESSION['user_account'] . "'"; 
$sql1 = @mysqli_query($link, $sql0);
$rows1 = @mysqli_num_rows($sql1);                       
$list4 = mysqli_fetch_assoc($sql1); // 紀錄當前操作者姓名   

if ($rows1 > 0) {
    // 【修正 2】加入與 Session 一致的帳號權限驗證
    if ($list4['F00'] != $_SESSION['user_id']) {
        echo json_encode("請勿蓄意修改成他人帳號後，再來異動資料！");
        return false;
    } else {
        $lastdate = date('Y-m-d');
        $mArlth = count($brr);  
        $flag = $brr[$mArlth - 2]; // 旗標 (0代表新增，其他數字代表 PK ID)

        if ($flag == 0) { // 新增						   
            $sql = "SELECT * FROM a22 WHERE F05='" . $brr[0] . "' AND F01='" . $brr[1] . "'"; 
            $sql2 = mysqli_query($link, $sql);
            $rows = @mysqli_num_rows($sql2);

            if ($rows > 0) {			 
                echo json_encode("資料庫已有此編號"); 
            } else {
                // 以下處理 MySQL 記錄新增  	        
                $mscnt = "INSERT INTO a22(F05, F01, F06, F02, F03, F04, F07, F20) VALUES (";	 			   
                $mscnt .= "'" . $brr[0] . "',";
                $mscnt .= "'" . $brr[1] . "',";
                $mscnt .= "'" . $brr[2] . "',";	 
                $mscnt .= "'" . $brr[3] . "',";	
                $mscnt .= "'" . $brr[4] . "',"; 		
                $mscnt .= "'" . $brr[5] . "',"; 	
                $mscnt .= "'" . $brr[6] . "',"; 				   
                $mscnt .= "'" . $lastdate . $list4['F03'] . "')";		      

                $sql = $mscnt;                                               
                mysqli_query($link, $sql) or die(mysqli_error($link));  
                $last_id = mysqli_insert_id($link); 				     
                $arr = array('order_no' => $last_id, 'lastupdate' => $lastdate . $list4['F03'], 'fldsatrr' => $trnarray);						 
                echo json_encode($arr);
            }   	     
        } else { // 修改
            $mscnt = "UPDATE a22 SET ";
            $mscnt .= "F06='" . $brr[2] . "',";	    
            $mscnt .= "F02='" . $brr[3] . "',";	   
            $mscnt .= "F03='" . $brr[4] . "',";	 
            $mscnt .= "F04='" . $brr[5] . "',";	 
            $mscnt .= "F07='" . $brr[6] . "',";	
            $mscnt .= "F20='" . $lastdate . $list4['F03'] . "'";
            $mscnt .= " WHERE F00='" . $flag . "'";

            $sql = $mscnt;                                                 
            mysqli_query($link, $sql) or die(mysqli_error($link));  	  
            $arr = array('order_no' => $flag, 'lastupdate' => $lastdate . $list4['F03'], 'fldsatrr' => $trnarray);
            echo json_encode($arr);
        }  
    }
} else {
    echo json_encode("請勿蓄意修改成他人帳號後，再來異動資料！");
}

mysqli_close($link);	
?>