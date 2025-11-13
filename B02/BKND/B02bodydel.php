<?php
  header("Content-Type:text/html; charset=utf-8");   
    include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];   
   $d04update="UPDATE d04 set d04.F23=d04.F23+(-1)
   *(SELECT b0b.F04 from b0b where d04.F01=b0b.F07 and d04.F02=b0b.F03 and b0b.F00='".$delmsg."') 
   where CONCAT(d04.F01,d04.F02) in (select CONCAT(F07,F03) from b0b where F00='".$delmsg."')";
   mysqli_query($link ,$d04update) or die(mysqli_error($link));
   
	  $mscnt="DELETE FROM `b0b` where `F00`='".$delmsg."'";
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	//echo json_encode(1);
?>
