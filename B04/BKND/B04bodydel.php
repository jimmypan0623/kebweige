<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔   	
   $delmsg=$_POST['filename'];   
   $sql7="SELECT b04.F10,b0d.F00 FROM b04,b0d WHERE b04.F01=b0d.F01 AND b0d.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
	   $c04update="UPDATE c04 set c04.F23=c04.F23+(-1)
	   *(SELECT b0d.F04 FROM b0d WHERE c04.F01=b0d.F07 AND c04.F02=b0d.F03 AND b0d.F00='".$delmsg."') 
	   WHERE CONCAT(c04.F01,c04.F02) IN (select CONCAT(F07,F03) FROM b0d WHERE F00='".$delmsg."')";
	   mysqli_query($link ,$c04update) or die(mysqli_error($link));
	   
		  $mscnt="DELETE FROM `b0d` WHERE `F00`='".$delmsg."'";
		 $sql=$mscnt;
							   
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		//echo json_encode(1);
	}else{
	    echo ("此出貨單已被確認過，無法刪除"); 
	}		
?>
