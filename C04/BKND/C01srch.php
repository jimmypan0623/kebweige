<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT c01.F01,c01.F05,c01.F07,c01.F39,c01.F32,c01.F33,c01.F04,a01.F03 as F0C,c01.F12,c01.F31,c01.F15,c01.F36 FROM c01 ";	 
	 $sql3=$sql3."left outer join a01 on c01.F33=a01.F01 ";
	 if(strlen($searchRecord)==0) {	  
         $sql3=$sql3." ";		
	 }else{		  
		$sql3=$sql3."WHERE ".$fieldNo." like '%".$searchRecord."%' "   ; 
	 }
	 $sql3=$sql3."order by ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('cust_no'=>$list3['F01'],  		            	             
		             'cust_name'=>$list3['F05'],
					 'sales_no'=>$list3['F33'],
					 'sales_name'=>$list3['F0C'],
					 'crncy_type'=>$list3['F39'],
					  'touch_person'=>$list3['F12'],
					 'ship_way'=>$list3['F31'],
					 'pay_way'=>$list3['F15'],
					 'pay_ment'=>$list3['F36'],
					 'dlvr_place'=>$list3['F07'],
					 'direct'=>$list3['F32'],
					 'custom_fullname'=>$list3['F04']
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 