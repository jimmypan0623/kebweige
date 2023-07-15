<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");        
   $delmsg=$_POST['filename'];
   $sql="select * from a01 where F04=ANY(SELECT F01 FROM `a14` where F00 in ".$delmsg.")";
   $sql2=mysqli_query($link,$sql);
   $rows=@mysqli_num_rows($sql2);
   if($rows>0){	 		          		  
      echo "此部門編號，已有人員資料";  	 
   }else{
	 $mscnt="DELETE FROM a14 where F00 in ".$delmsg;  //先把準備刪除的SQL 語法後半段先寫在字串中
	  
	 $sql=$mscnt;
	
   }                      
    mysqli_query($link ,$sql) or die(mysqli_error($link));  
	mysqli_close($link);
?>
