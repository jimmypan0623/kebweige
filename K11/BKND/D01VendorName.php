<?php
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                              //引用檔     
	 
	 $sql3="SELECT `d01`.`F04`,`d01`.`F39`,`a01`.`F03` ";
	
	 $sql3.="FROM `d01` ";
	
     $sql3.="LEFT OUTER JOIN `a01` ON `a01`.`F01`=`d01`.`F39` ";	
	 $sql3.="WHERE binary `d01`.`F01` ='".$_POST['filename']."' and d01.F14 <= CURDATE()";	 	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array('customname'=>$list3['F04'],		  	            
						 'whono'=>$list3['F39'],
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

 