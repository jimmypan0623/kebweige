<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");     
   $delmsg=$_POST['filename'];
   
   $sql7="SELECT c03.F04,c04.F00 FROM c03,c04 WHERE c03.F01=c04.F01 AND c04.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F04']!='Y'){
	   
		 $mscnt="DELETE FROM `c04` WHERE `F00`='".$delmsg."'";
		 $sql=$mscnt;
							   
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		//echo json_encode(1);
	}else{
	    echo ("此客戶訂單已被確認過，無法刪除"); 
	}		
 
?>
