<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");     
   $delmsg=$_POST['filename'];
    $sql7="SELECT d03.F04,d04.F00 FROM d03,d04 WHERE d03.F01=d04.F01 AND d04.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F04']!='Y'){
	   
		 $mscnt="DELETE FROM `d04` WHERE `F00`='".$delmsg."'";
		 $sql=$mscnt;
							   
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		//echo json_encode(1);
	}else{
	    echo ("此採購單已被確認過，無法刪除"); 
	}		
?>
