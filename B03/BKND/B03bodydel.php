<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];   
    $sql7="SELECT b03.F10,b0c.F00 FROM b03,b0c WHERE b03.F01=b0c.F01 AND b0c.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
		$sql15="SELECT * FROM b03 WHERE F01=(SELECT F01 FROM b0c WHERE F00='".$delmsg."')";
		$sql16=@mysqli_query($link,$sql15);
		$list5=mysqli_fetch_array($sql16);  //紀錄表頭折讓貨退貨	 
		if(intval($list5['F24'])<3){   //非折讓就要寫入原訂單開單未過帳量
		   $d04update="UPDATE d04 SET d04.F24=d04.F24+(-1)
		   *(SELECT b0c.F04 FROM b0c WHERE d04.F01=b0c.F07 AND d04.F02=b0c.F03 AND b0c.F00='".$delmsg."') 
		   WHERE CONCAT(d04.F01,d04.F02) IN (SELECT CONCAT(F07,F03) FROM b0c WHERE F00='".$delmsg."')";
		}   
		mysqli_query($link ,$d04update) or die(mysqli_error($link));   
	   
		  $mscnt="DELETE FROM `b0c` WHERE `F00`='".$delmsg."'";
		 $sql=$mscnt;                           
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		//echo json_encode(1);
	}else{
	   echo ("此進貨退出單已被確認過，無法刪除"); 
	}
?>
