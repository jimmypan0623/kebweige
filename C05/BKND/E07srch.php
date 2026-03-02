<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
 
		/* $sql3="SELECT * FROM b26 ";			  
	   	$sql3.=" WHERE b26.F02='".$str[1]."' AND b26.F01='".$str[0]."'  AND F90='".$str[2]."' order by b26.F03,b26.F07 ";  */
        
		$sql7="(SELECT c04.F00,c04.F01,c04.F02,c04.F06,(c04.F03-c04.F09-c04.F21)*(-1) AS RST,c03.F03,c01.F05 AS ABR FROM c04 ";
	$sql7.=" LEFT JOIN c03 ON c03.F01=c04.F01 "; 
	$sql7.=" LEFT JOIN c01 ON c01.F01=c03.F03 ";
	$sql7.="WHERE c04.F02='".$str[0]."' AND c04.F03-c04.F09-c04.F21>0 AND c03.F04='Y' ";			 
	$sql7.=") UNION(SELECT d04.F00,d04.F01,d04.F02,d04.F06,d04.F03-d04.F09-d04.F21 AS RST,d03.F03,d01.F04 AS ABR FROM d04 ";
	$sql7.="LEFT JOIN d03 ON d03.F01=d04.F01 ";
	$sql7.=" LEFT JOIN d01 ON d01.F01=d03.F03 ";
	$sql7.=" WHERE d04.F02='".$str[0]."' AND d04.F03-d04.F09-d04.F21>0 AND d03.F04='Y' ";	
	$sql7.=" ) order by F02,F06,RST DESC";
		
		
		
		
		
	$arr=array();	
    $sql4=@mysqli_query($link,$sql7); 
	while ($list3=mysqli_fetch_assoc($sql4)){	
	   $str[1]=$str[1]+$list3['RST'];
		$atr = array('rc_no_IHC_000'=>substr($list3['F01'],0,2).$list3['F00'],
		             'order_no_ISC_010'=>$list3['F01'],
					 'order_type_ISC_004'=>substr($list3['F01'],0,2)=='CA'?'出貨':'進貨' ,
		             'ship_date_ISC_010'=>$list3['F06'],
		             'ship_qty_ISR_010'=>$list3['RST'], 
					 'left_qty_ISR_010'=>$str[1], 
		             'object_no_ISC_007'=>$list3['F03'],
					  'object_name_ISC_008'=>$list3['ABR']
					 );          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
	 
        // echo "srchStockNo($json_string1)";    
       
		 

?>  

 