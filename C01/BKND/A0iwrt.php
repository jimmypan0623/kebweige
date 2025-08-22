<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");
   $objno=substr($_POST['filename'],0,5);
   $discardno=substr(strrchr($_POST['filename'],'|'),1);
   $str = trim($discardno);
    $count=strlen($str);
   if($count>0){
	 $mscnt="INSERT INTO a0i (F01,F08) VALUES ('".$objno."','".$discardno."')";
   		   
	 $sql=$mscnt;
                           
      mysqli_query($link ,$sql) or die(mysqli_error($link));  
   }	
	mysqli_close($link);
	
	//echo json_encode(1);
?>
