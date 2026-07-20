<?php
   require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                      //引用檔 
	$searchRecord =$_POST['filename'];	   
	$sql3="SELECT F01,F02 FROM `a14` WHERE F04 = 'Y' AND F12='Y' AND F13='Y' order by F01 ";          
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('dpt_no'=>$list3['F01'],  		            	             
		             'dpt_name'=>$list3['F02']);                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);          
         echo json_encode(array ('recdrow'=>$arr,'crntkey'=>$searchRecord)); 
        
?>  

 