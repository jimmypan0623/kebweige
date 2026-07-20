<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔   	
   $delmsg=$_POST['filename'];   
   $sql7="SELECT b06.F10,b0f.F00 FROM b06,b0f WHERE b06.F01=b0f.F01 AND b0f.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
		$mscnt="DELETE FROM `b0f` WHERE `F00`='".$delmsg."'";
		$sql=$mscnt;							   
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		
	}else{
	    echo ("此移轉單已被確認過，無法刪除"); 
	}		
?>
