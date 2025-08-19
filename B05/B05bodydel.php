<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");      
   $delmsg=$_POST['filename'];   
   $c04update="UPDATE c04 set c04.F23=c04.F23+(-1)
   *(SELECT b0e.F04 from b0e where c04.F01=b0e.F07 and c04.F02=b0e.F03 and b0e.F00='".$delmsg."') 
   where CONCAT(c04.F01,c04.F02) in (select CONCAT(F07,F03) from b0e where F00='".$delmsg."')";
   mysqli_query($link ,$c04update) or die(mysqli_error($link));
   
	  $mscnt="DELETE FROM `b0e` where `F00`='".$delmsg."'";
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	//echo json_encode(1);
?>
