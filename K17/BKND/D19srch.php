<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔      
    $str1=$_POST['filename'];
	$sql3="SELECT * FROM d19 WHERE d19.F02='".$str1."' ORDER BY d19.F05";			  
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		  
		$atr = array('material_DSL_025'=>$list3['F05'],
		             'shipbillno_DSC_012'=>$list3['F02'] ,
		             'shipqty_DSR_012'=>$list3['F06'] ,
		             'unitproce_DSR_012'=>$list3['F07'],
		              'crncytype_DSC_005'=>$list3['F13'], 
					  'crncyrate_DSR_012'=>$list3['F14'],		         
					  'ttlmoney_DSR_012'=>$list3['F06']*$list3['F07']*$list3['F14']);        
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 

?>  

 