<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");      
   $delmsg=$_POST['filename'];
   
	//$mscnt="DELETE FROM a02 where F00 in ".$delmsg;  //先把準備刪除的SQL 語法後半段先寫在字串中
	  $mscnt="DELETE FROM a02 where ".$delmsg;
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	mysqli_close($link);
	echo 1;
	//echo json_encode(1);
?>
