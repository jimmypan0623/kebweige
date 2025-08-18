<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔   
	$searchRecord =$_POST['filename'];		
	 
	 		 $sql3="SELECT `F01`,`F03` FROM `a01` WHERE `F01` NOT IN (SELECT `F01` FROM a02 WHERE `F03`=".$searchRecord." AND `F13` > NOW() ORDER BY F01";
	
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('stuff_no'=>$list3['F01'],  		            	             
		             'stuff_name'=>$list3['F03']);                              
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 