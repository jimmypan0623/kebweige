<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("include/mysqli_server.php");      
   $delmsg=$_POST['filename'];
   
	$mscnt="DELETE FROM q78 where F00 in ".$delmsg;  //先把準備刪除的SQL 語法後半段先寫在字串中
	  
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	
?>
