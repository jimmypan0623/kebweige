<?php
require_once("../../include/BKND/auth_check.php"); // 驗證
$str_json = file_get_contents('php://input'); 
$response = json_decode($str_json, true);   // 一次解碼

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

$trnarray = fldafterwrite('A02', '2', $link, true);           

    // 【修正點 1】改為與表頭一致的 Session 驗證方式
    if ($list4['F00'] != $_SESSION['user_id']) {
        echo json_encode("請勿蓄意修改成他人帳號後，再來異動資料！");
        return false;
    } else {	 	 	 
        $lastdate = date('Y-m-d');
        $mArlth = count($brr);  
        $flag = $brr[$mArlth - 2]; // 主鍵/新增旗標 (0代表新增)

        if ($flag == 0) { // 新增
            $sql = "SELECT * FROM a02 WHERE F01='" . $brr[0] . "' AND F03='" . $brr[1] . "'"; 
            $sql2 = mysqli_query($link, $sql);
            $rows = @mysqli_num_rows($sql2);

            if ($rows > 0) {			 
                echo json_encode("資料庫已有此編號"); 
            } else {             			  
                $mscnt = "INSERT INTO a02(F01,F03,F04,F05,F06,F07,F08,F09,F10,F11,F12,F13) VALUES (";
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
                $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";		      
                
                $sql = $mscnt;                                               
                mysqli_query($link, $sql) or die(mysqli_error($link));  
                $last_id = mysqli_insert_id($link);     				     
                $arr = array('order_no' => $last_id, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);						 
                echo json_encode($arr);
            }
        } else { // 修改
            $mscnt = "UPDATE a02 SET ";	    
            $mscnt .= "F04='" . $brr[2] . "',";
            $mscnt .= "F06='" . $brr[4] . "',";
            $mscnt .= "F07='" . $brr[5] . "',";	 
            $mscnt .= "F08='" . $brr[6] . "',";	
            $mscnt .= "F09='" . $brr[7] . "',";	
            $mscnt .= "F10='" . $brr[8] . "',";
            $mscnt .= "F11='" . $brr[9] . "',";			  
            $mscnt .= "F12='" . $brr[10] . "',";
            $mscnt .= "F13='" . $lastdate . $_SESSION['user_name'] . "'";
            $mscnt .= " WHERE F00='" . $flag . "'";

            $sql = $mscnt;                                                 
            mysqli_query($link, $sql) or die(mysqli_error($link));  	  
            $arr = array('order_no' => $flag, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);
            echo json_encode($arr);    
        }  
    }

mysqli_close($link);	
?>