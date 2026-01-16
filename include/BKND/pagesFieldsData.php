<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔     
	 
	 
	 $sql3="SELECT F02,F03,F07 FROM a04 WHERE binary F01 ='".$_POST['filename']."' AND F05='S' ORDER BY F02";	 	 
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array(
		  	             'field_order'=>$list3['F02'],
						 'field_name'=>$list3['F03'],						 
						 'width_ratio'=>$list3['F07']						
						 );                              
		    array_push($arr,$atr);
	    }
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 

?>  

 