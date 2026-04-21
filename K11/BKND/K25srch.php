<?php
   header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔         
	  
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	  
	 $sql3="SELECT * FROM k25 ";	  
	
	if(strlen($str[1])==0) {	          
		  $sql3=$sql3."WHERE k25.F03='".$str[2]."' AND k25.F12-k25.F27-k25.F28>0 "; 
	}else{
	    $sql3=$sql3."WHERE ".$str[0]." LIKE '%".trim($str[1])."%' AND k25.F03='".$str[2]."' AND k25.F12-k25.F27-k25.F28>0 "; 			
	}
	 $sql3=$sql3."ORDER BY ".$str[0];
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('bill_no_ISC_020'=>$list3['F15'],  		            	             
		             'invoice_no_ISC_020'=>$list3['F07'], 					 
					 'invoice_date_ISC_020'=>$list3['F90'].'-'.$list3['F02'],
					  'invoice_money_ISR_020'=>$list3['F12'],
					   'invoice_rest_ISR_020'=>$list3['F12']-$list3['F27']-$list3['F28']
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
 
?>  

 