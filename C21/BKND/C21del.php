<?php
  header("Content-Type:text/html; charset=utf-8");   
  include("../../include/BKND/mysqli_server.php");       
   $delmsg=$_POST['filename'];
   $mscnt="DELETE FROM `c27` where F01 in(select F01 from c26 where F00='".$delmsg."')";
   $sql=$mscnt;                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
   $mscnt="DELETE FROM `c26` where `F00`='".$delmsg."'";
   $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	//echo json_encode(1);
?>
