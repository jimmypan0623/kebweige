<?php
   header("Content-Type:text/html; charset=utf-8");   
    include("../../include/BKND/mysqli_server.php");                              //引用檔         
	  
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	  
	 $sql3="SELECT b02.F01,b02.F20,b02.F14,b02.F16,b02.F22,b02.F23,d00.F02 as F0B FROM b02 ";	  
	  $sql3=$sql3."LEFT OUTER join d00 ON b02.F14=d00.F01 ";
	 if(strlen($str[1])==0) {	          
		  $sql3=$sql3."WHERE b02.F90 ='".$str[2]."' AND b02.F06='".$str[3]."'"; 
	 }else{
	    $sql3=$sql3."WHERE ".$str[0]." LIKE '%".trim($str[1])."%' AND b02.F90='".$str[2]."' AND b02.F06='".$str[3]."'"; 			
	 }
	 $sql3=$sql3."ORDER BY ".$str[0];
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('bill_no_ISL_050'=>$list3['F01'],  		            	             
		             'invoice_no_ISL_050'=>$list3['F20'],					 
					 'crncy_type_IHL_000'=>$list3['F14'],					 	
					 'curncy_rate_IHL_000'=>$list3['F16'],    //6
					 'invoice_type_IHL_000'=>$list3['F22'],    //7
					 'tax_type_IHL_000'=>$list3['F23']   ///8					
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
 
?>  

 