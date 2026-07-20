<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];   
   $sql7="SELECT b05.F10,b0e.F00 FROM b05,b0e WHERE b05.F01=b0e.F01 AND b0e.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
		$sql15="SELECT * FROM b05 WHERE F01=(SELECT F01 FROM b0e WHERE F00='".$delmsg."')";
		$sql16=@mysqli_query($link,$sql15);
		$list5=mysqli_fetch_array($sql16);  //紀錄表頭折讓貨退貨	 
		if(intval($list5['F24'])<3){   //非折讓就要寫入原訂單開單未過帳量
		   $c04update="UPDATE c04 SET c04.F24=c04.F24+(-1)
		   *(SELECT b0e.F04 FROM b0e WHERE c04.F01=b0e.F07 AND c04.F02=b0e.F03 AND b0e.F00='".$delmsg."') 
		   WHERE CONCAT(c04.F01,c04.F02) IN (SELECT CONCAT(F07,F03) FROM b0e WHERE F00='".$delmsg."')";
		}   
		mysqli_query($link ,$c04update) or die(mysqli_error($link));   
	   
		  $mscnt="DELETE FROM `b0e` WHERE `F00`='".$delmsg."'";
		 $sql=$mscnt;                           
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		//echo json_encode(1);
	}else{
	     echo ("此出貨退回單已被確認過，無法刪除"); 
	}
?>
