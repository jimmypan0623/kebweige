<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];    
 
   $c04update="UPDATE c04 SET c04.F24=c04.F24+(-1)
   *(SELECT b0e.F04 FROM b0e WHERE c04.F01=b0e.F07 AND c04.F02=b0e.F03 AND b0e.F01='".$delmsg."') 
   WHERE CONCAT(c04.F01,c04.F02) IN (SELECT CONCAT(F07,F03) FROM b0e WHERE F01='".$delmsg."')";
   mysqli_query($link ,$c04update) or die(mysqli_error($link));    
   $mscnt="DELETE FROM b0e WHERE b0e.F01='".$delmsg."'";
   $sql=$mscnt;                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
   $mscnb="DELETE FROM b05 WHERE b05.F01='".$delmsg."'";
   $sql1=$mscnb;                          
    mysqli_query($link ,$sql1) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	//echo json_encode(1);
?>
