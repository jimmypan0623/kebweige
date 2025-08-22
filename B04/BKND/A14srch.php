<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
	$searchRecord =trim($_POST['filename']);		
	 $sql3="SELECT `F01`,`F02` FROM `a14` ";
	 if(strlen($searchRecord)==0) {
	  
         $sql3=$sql3."WHERE F04='Y' ";		
	 }else{
		   $sql3=$sql3."WHERE `F01` like '%".$searchRecord."%' AND F04='Y'";	 
	 }
	 $sql3=$sql3."ORDER BY `F01`";
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('dept_no'=>$list3['F01'],  		            	             
		             'dept_name'=>$list3['F02']);                              
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 