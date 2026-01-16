<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT c01.F01,c01.F05,c01.F33,a01.F03 as F0C FROM c01 ";	 
	 $sql3=$sql3."LEFT OUTER join a01 ON c01.F33=a01.F01 ";
	 
	 if(strlen($searchRecord)==0) {	          
		  $sql3=$sql3."WHERE c01.F16 < CURDATE()";
	 }else{
	    $sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' and c01.F16 <= CURDATE()"; 
	 }
	 $sql3=$sql3."ORDER BY ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('cust_no_ISL_050'=>$list3['F01'],  		            	             
		             'cust_name_ISL_050'=>$list3['F05'],
					 'sales_no_IHL_000'=>$list3['F33'],
					 'sales_name_IHL_000'=>$list3['F0C']					
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
        
?>  

 