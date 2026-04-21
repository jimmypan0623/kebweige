<?php
   header("Content-Type:text/html; charset=utf-8");   

  require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
	$searchRecord =$_POST['filename'];		
	$sql3="SELECT `F02`  FROM `c00` where `F01`='".$searchRecord."'";
    $sql4=@mysqli_query($link,$sql3); 
	 $list1=mysqli_fetch_assoc($sql4); 
	 	mysqli_close($link);     
	 echo $list1['F02'];	 	
  	           
?>  

 