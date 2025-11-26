<?php
 header("Content-Type:text/html; charset=utf-8");   
 include("../../include/BKND/mysqli_server.php");          //引用檔   
        $str=explode(',',$_POST['filename']);  //將上面字串以逗號分割成陣列		 
		 $customno=trim($str[2]);
	  $searchRecord =trim($str[1]);		
	  
	 $sql3="SELECT b01.F01,b01.F02,b01.F04,b01.F28,b01.F31,b01.F38,d02A.F13,d02A.F08,d02A.F04 as F0D,d02A.F07,d02A.F15,c20.F03 AS F0C,c20.F15 AS F1E FROM b01 ";	 	
	 $sql3.="left outer join (select F01,F02,F03,F04,F06,F07,F08,F13,F15 from d02 where F06='".$str[3]."' AND F01='".$customno."' AND (CURDATE() BETWEEN F02 AND F15) order by F15 ) as d02A on d02A.F03=b01.F01  ";	
	  $sql3.="LEFT OUTER JOIN c20 ON c20.F01=b01.F01 ";
	 if(strlen($searchRecord)==0) {	  
         $sql3=$sql3."WHERE LEFT(F98,1)='Y' OR F98='NNN' ";		
	 }else{

		$sql3=$sql3."WHERE ".$str[0]." like '%".$searchRecord."%' AND (LEFT(F98,1)='Y' OR F98='NNN') "   ; 
	 }
	 $sql3=$sql3."order by ".$str[0];
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$itemno=0;
	while ($list3=mysqli_fetch_assoc($sql4)){
		$itemno++; 
		$atr = array('item_no_IHC_000'=>$itemno,
		             'stock_no_ISL_026'=>$list3['F01'],  		            	             
		             'stock_name_ISL_020'=>$list3['F02'],
					 'unit_name_IHL_000'=>$list3['F04'],
					 'basic_qty_IHL_000'=>($list3['F13']>0?$list3['F13']:$list3['F0C']),
					 'minum_qty_ISR_010'=>($list3['F08']>0?$list3['F08']:$list3['F1E']),	
					 'custom_part_ISL_018'=>$list3['F0D'],	
					 'invalid_date_ISC_011'=>$list3['F15'],
					 'order_price_ISR_010'=>($list3['F07']>0?$list3['F07']:$list3['F38']),
					 'leadtime_IHL_000'=>($list3['F28']+$list3['F31'])
					 );    					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	   
?>  

 