<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];   
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
?>
