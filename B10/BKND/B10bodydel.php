<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   	
   $delmsg=$_POST['filename'];   
   $sql7="SELECT b10.F10,b0i.F00 FROM b10,b0i WHERE b10.F01=b1z.F01 AND b1z.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
		$mscnt="DELETE FROM `b1z` WHERE `F00`='".$delmsg."'";
		$sql=$mscnt;							   
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		
	}else{
	    echo ("此移轉單已被確認過，無法刪除"); 
	}		
?>
