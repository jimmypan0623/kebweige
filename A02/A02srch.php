﻿<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔
  
   
 
   
    
	    $searchRecord =$_POST['filename'];
	   
		$sql3="SELECT F01,F02 FROM `a14` WHERE char_length(F01)=4 order by F01"; 
         
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('dpt_no'=>$list3['F01'],  		            	             
		             'dpt_name'=>$list3['F02']);                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 		          		  
         echo "optionadd($json_string1,$searchRecord)";    
       
		 
 		 
          
?>  

 