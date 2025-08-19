<?php
//$sql3=$sql3."left outer join `a01` on `a01.F01`=`c01.F33` ";,`c01.F33`,`c01.F12`,`c01.F31`,`c01.F15`,`c01.F36`
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔   
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	    $searchRecord =trim($filterKey);		
     $sql3="SELECT d01.F01,d01.F04,d01.F25,d01.F39,a01.F03 as F0C,d01.F08,d01.F19,d01.F13,d01.F36 FROM d01 ";	 
      $sql3=$sql3."left outer join a01 on d01.F39=a01.F01 ";
	//$sql3="SELECT * from d01 ";
	 if(strlen($searchRecord)==0) {	  
      
	   $sql3=$sql3."WHERE d01.F12 !='X'";
	 }else{
		     
		$sql3=$sql3."WHERE ".$fieldNo." like '%".$searchRecord."%' "   ; 
	 }
	//$sql3=$sql3."order by ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('vend_no'=>$list3['F01'],  		            	             
		             'vend_name'=>$list3['F04'],
					 'purchs_no'=>$list3['F39'],
					 'purchs_name'=>$list3['F0C'],
					 'crncy_type'=>$list3['F25'],
					 'touch_person'=>$list3['F08'],
					 'ship_way'=>$list3['F19'],
					 'pay_way'=>$list3['F13'],
					 'pay_ment'=>$list3['F36']									
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 