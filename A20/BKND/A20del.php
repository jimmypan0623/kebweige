<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                      //引用檔     
   $delmsg=$_POST['filename'];
   $mscnt="DELETE FROM `a22` where F05 in(select F01 from a20 where F00='".$delmsg."')";
   $sql=$mscnt;                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
   $mscnt="DELETE FROM `a20` where `F00`='".$delmsg."'";
   $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	//echo json_encode(1);
?>
