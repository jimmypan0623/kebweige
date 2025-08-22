<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔 
	$searchRecord =$_POST['filename'];	   
	$sql3="SELECT F01,F04 FROM `d00` WHERE 1 order by F01 ";          
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){		 
		$atr = array('crnt_no'=>$list3['F01'],  		            	             
		             'crnt_name'=>$list3['F04']);                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);

 		echo json_encode(array ('recdrow'=>$arr,'crntkey'=>$searchRecord));		 
          
?>  

 