<?php
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");   
   $delmsg=$_POST['filename'];
   $sql7="select F04 from d03 where F01='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F04']!='Y'){      
       $mscnt="DELETE FROM d04 WHERE d04.F01='".$delmsg."'";
       $sql=$mscnt;                           
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
       $mscnb="DELETE FROM d03 WHERE d03.F01='".$delmsg."'";
       $sql1=$mscnb;                          
       mysqli_query($link ,$sql1) or die(mysqli_error($link));  
	   mysqli_close($link);
	   echo 1;
	}else{
	    echo ("此採購單已被確認過，無法刪除"); 
	}

?>
