<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)

// 【修正】原本這裡是「雙重 json_decode」：
//   $response = json_decode($str_json);
//   $cart = json_decode($response);
// 對齊 C04wrt.php / B04wrt.php / B04bodywrt.php 的修法：
// 前端已改為單次 stringify(真實物件)，這裡直接一次解碼即可。
$cart = json_decode($str_json, true);   // 前端已改為單次 stringify(真實物件)，這裡直接一次解碼
if ($cart === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($cart as $key => $val) {
    $brr[] = addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
require_once("../../include/BKND/mysqli_server.php"); 
require_once "../../include/BKND/fieldDOMset.php"; 

$trnarray = fldafterwrite('A26', '1', $link, true);    

  
        $lastdate = date('Y-m-d');
        $mArlth = count($brr);  
        $flag = $brr[$mArlth - 2]; // 旗標 (0代表新增，其他數字代表 PK ID)

        if ($flag == 0) { // 新增						   
            $sql = "SELECT * FROM a26 WHERE F01='" . $brr[0] . "'"; 
            $sql2 = mysqli_query($link, $sql);
            $rows = @mysqli_num_rows($sql2);

            if ($rows > 0) {			 
                echo json_encode("資料庫已有此編號"); 
            } else {
                // 以下處理 MySQL 記錄新增  	        
                $mscnt = "INSERT INTO a26(`F01`,`F02`,`F03`,`F04`,`F05`,`F06`,`F07`,`F08`,`F09`) VALUES (";	    
                $mscnt .= "'" . $brr[0] . "',";
                $mscnt .= "'" . $brr[1] . "',";
                $mscnt .= "'" . $brr[2] . "',";
                $mscnt .= "'" . $brr[3] . "',";
                $mscnt .= "'" . $brr[4] . "',";	  
                $mscnt .= "'" . $brr[5] . "',";	 
                $mscnt .= "'" . $brr[6] . "',";	 	
                $mscnt .= "'" . $brr[7] . "',";	 	
                $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";	

                $sql = $mscnt;                                               
                mysqli_query($link, $sql) or die(mysqli_error($link));  
                $last_id = mysqli_insert_id($link); 				     
                $arr = array('order_no' => $last_id, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);						 
                echo json_encode($arr);
            }   	     
        } else { // 修改
            $mscnt = "UPDATE a26 SET ";
            $mscnt .= "F02='" . $brr[1] . "',";	    
            $mscnt .= "F03='" . $brr[2] . "',";	   
            $mscnt .= "F04='" . $brr[3] . "',";	   
            $mscnt .= "F05='" . $brr[4] . "',";	   
            $mscnt .= "F06='" . $brr[5] . "',";	   
            $mscnt .= "F07='" . $brr[6] . "',";	   
            $mscnt .= "F08='" . $brr[7] . "',";	         		 
            $mscnt .= "F09='" . $lastdate . $_SESSION['user_name'] . "'";
            $mscnt .= " WHERE F00='" . $flag . "'";

            $sql = $mscnt;                                                 
            mysqli_query($link, $sql) or die(mysqli_error($link));  	  
            $arr = array('order_no' => $flag, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);
            echo json_encode($arr);
        }  
     

mysqli_close($link);	
?>