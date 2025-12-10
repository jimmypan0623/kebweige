<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT d01.F01,d01.F04,d01.F25,d01.F39,a01.F03 as F0C,d01.F08,d00.F02 as F0B FROM d01 ";	 
	 $sql3=$sql3."LEFT OUTER join a01 ON d01.F39=a01.F01 ";
	  $sql3=$sql3."LEFT OUTER join d00 ON d01.F25=d00.F01 ";
	 if(strlen($searchRecord)==0) {	          
		  $sql3=$sql3."WHERE d01.F14 <= CURDATE()";
	 }else{
	    $sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' and d01.F14  <= CURDATE()"; 
	 }
	 $sql3=$sql3."ORDER BY ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('cust_no_ISL_050'=>$list3['F01'],  		            	             
		             'cust_name_ISL_050'=>$list3['F04'],
					 'sales_no_IHL_000'=>$list3['F39'],
					 'sales_name_IHL_000'=>$list3['F0C'],
					 'crncy_type_IHL_000'=>$list3['F25'],
					 'touch_person_IHL_000'=>$list3['F08'],				
					 'curncy_rate_IHL_000'=>$list3['F0B'],    //6
					 			
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
        
?>  

 