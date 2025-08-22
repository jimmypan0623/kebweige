<?php
    header("Content-Type:text/html; charset=utf-8");   
    include("../../include/BKND/mysqli_server.php");                              //引用檔   
    $fieldNo=substr($_POST['filename'],0,7);
	$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	$searchRecord =trim($filterKey);		
	$sql3="SELECT b01.F01,b01.F02,b01.F04,c20.F03,c20.F15 FROM b01 ";	 
	$sql3.="left outer join c20 on c20.F01=b01.F01 ";	
	if(strlen($searchRecord)==0) {	  
        $sql3=$sql3."WHERE LEFT(F98,1)='Y' OR F98='NNN' ";		
	}else{
	    $sql3=$sql3."WHERE ".$fieldNo." like '%".$searchRecord."%' AND (LEFT(F98,1)='Y' OR F98='NNN') "   ; 
	}
	 $sql3=$sql3."order by ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){		 
		$atr = array('stock_no'=>$list3['F01'],  		            	             
		             'stock_name'=>$list3['F02'],
					 'unit_name'=>$list3['F04'],
					 'basic_qty'=>$list3['F03'],
					 'minum_qty'=>$list3['F15']					
					 );     					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	   
?>  

 