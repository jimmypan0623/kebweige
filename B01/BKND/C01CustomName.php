<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                      //引用檔 
	
	 $sql3="SELECT `F04`,`F05` FROM `c01` WHERE binary `F01` ='".$_POST['filename']."' AND `F03`!='X' AND `F01`=`F44`";	 	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_array($sql4)){
		 
		    $atr = array('customname'=>$list3['F05'],
		  	             'customfullname'=>$list3['F04']);                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('customname'=>"",
		             'customfullname'=>"");                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 