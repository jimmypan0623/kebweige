<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔   
	
	 $sql3="SELECT `F03`,`F15` FROM `c20` WHERE `F01` ='".$_POST['filename']."'"	;	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_array($sql4)){
		 
		    $atr = array('basic_qty'=>$list3['F03'],  		            	             
		             'mini_qty'=>$list3['F15']);                              
		    array_push($arr,$atr);
	    }
	}else{
		 $atr = array('basic_qty'=>1,  		            	             
		             'mini_qty'=>1);      
		array_push($arr,$atr);			 
	}		
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 