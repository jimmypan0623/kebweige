<?php
   header("Content-Type:text/html; charset=utf-8");   
    include("../../include/BKND/mysqli_server.php");                              //引用檔     	 
	 $sql3="SELECT `c01`.`F05`,`c01`.`F33`,`a01`.`F03` ";	
	 $sql3.="FROM `c01` ";	
     $sql3.="LEFT OUTER JOIN `a01` ON `a01`.`F01`=`c01`.`F33` ";	
	 $sql3.="WHERE binary `c01`.`F01` ='".$_POST['filename']."' AND c01.F16 <= CURDATE()";	 	 
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array('customname'=>$list3['F05'],		  	            
						 'whono'=>$list3['F33'],
						 'whonameEx'=>$list3['F03']						 
						 );                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('customname'=>"",		           					 
					 'whono'=>"",
					 'whonameEx'=>"" 					  
					 );                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
         
?>  

 