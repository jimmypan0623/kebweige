<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response = json_decode($str_json, true);   // 前端已改為單次 stringify(真實物件)，這裡直接一次解碼

if ($response === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($response as $key => $val) {	   
    $brr[] = addslashes($val);		//要加入此函數避免中間有單引號錯亂
}

require_once("../../include/BKND/mysqli_server.php");                      //引用檔  
require_once "../../include/BKND/fieldDOMset.php"; // 引入     
$trnarray = fldafterwrite('A01', '3', $link, true);  	

$lastdate = date('Y' . '-' . 'm' . '-' . 'd');	 
$mArlth = count($brr);  
if ($brr[$mArlth - 2] == 0) {        //如果旗標指示為新增						   	    			 
    //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
    //以下處理MySQL記錄新增  	        
    $mscnt = "INSERT INTO a04(F01,F02,F03,F04,F05,F06,F07,F08,F09,F15) VALUES (";
    $mscnt .= "'" . $brr[0] . "',";
    $mscnt .= "'" . $brr[1] . "',";
    $mscnt .= "'" . $brr[2] . "',";	 
    $mscnt .= "'" . $brr[3] . "',";	
    $mscnt .= "'" . $brr[4] . "',"; 		
    $mscnt .= "'" . $brr[5] . "',"; 	
    $mscnt .= "" . $brr[6] . ",";	
    $mscnt .= "'" . $brr[7] . "',"; 		
    $mscnt .= "'" . $brr[8] . "',"; 					
    $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";		      
    $sql = $mscnt;                                               //寫入MySQL 	 
    mysqli_query($link, $sql) or die(mysqli_error($link));  
    $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
    $arr = array('order_no' => $last_id, 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);						 
    echo json_encode($arr);		      
} else {	   //修改
    $mscnt = "UPDATE a04 SET F02=" . "'" . $brr[1] . "',";	    
    $mscnt .= "F03=" . "'" . $brr[2] . "',";	   
    $mscnt .= "F04=" . "'" . $brr[3] . "',";	 
    $mscnt .= "F05=" . "'" . $brr[4] . "',";	 
    $mscnt .= "F06=" . "'" . $brr[5] . "',";	
    $mscnt .= "F07=" . "" . $brr[6] . ",";	
    $mscnt .= "F08=" . "'" . $brr[7] . "',";	
    $mscnt .= "F09=" . "'" . $brr[8] . "',";		  
    $mscnt .= "F15=" . "'" . $lastdate . $_SESSION['user_name'] . "'";   // 移除多餘的 F15=$brr[9] 那行
    $mscnt .= " WHERE F00=" . "'" . $brr[$mArlth - 2] . "'";
    $sql = $mscnt;                                                 //寫入MySQL 	 
    mysqli_query($link, $sql) or die(mysqli_error($link));  	  
    $arr = array('order_no' => $brr[$mArlth - 2], 'lastupdate' => $lastdate . $_SESSION['user_name'], 'fldsatrr' => $trnarray);
    echo json_encode($arr);
    //echo $brr[11];
}  

mysqli_close($link);	
?>