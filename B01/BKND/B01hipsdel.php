<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                      //引用檔 
   $delmsg=$_POST['filename'];

	  $mscnt="DELETE FROM `d02` where `F00`='".$delmsg."'";
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	 
?>
