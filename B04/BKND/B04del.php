<?php
  header("Content-Type:text/html; charset=utf-8");   
    include("../../include/BKND/mysqli_server.php");                              //引用檔        
   $delmsg=$_POST['filename'];    
 
   $c04update="UPDATE c04 set c04.F23=c04.F23+(-1)
   *(SELECT b0d.F04 from b0d where c04.F01=b0d.F07 and c04.F02=b0d.F03 and b0d.F01='".$delmsg."') 
   where CONCAT(c04.F01,c04.F02) in (select CONCAT(F07,F03) from b0d where F01='".$delmsg."')";
   
  
   mysqli_query($link ,$c04update) or die(mysqli_error($link)); 
   
   $mscnt="DELETE FROM b0d where b0d.F01='".$delmsg."'";
   $sql=$mscnt;                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
   $mscnb="DELETE FROM b04 where b04.F01='".$delmsg."'";
   $sql1=$mscnb;
                           
    mysqli_query($link ,$sql1) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	//echo json_encode(1);
?>
