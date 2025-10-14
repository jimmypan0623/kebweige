<?php
    header("Content-Type:text/html; charset=utf-8");   
    include("../../include/BKND/mysqli_server.php");                              //引用檔   
    $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key		
	$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 
	$shipno=trim(substr(strrchr($_POST['filename'],'_'),1));   //出貨單號		 
	$searchRecord =trim($filterKey);			
	$sql3="SELECT b0d.F03,b01.F02 AS F0B,b0d.F07,LEAST((c04.F09-c04.F24),b0d.F04) AS avlq,";   
	$sql3.="b0d.F15,b0d.F08,b0d.F09,b01.F07 AS F0G,a14.F02 AS FZ2 FROM b0d ";
	$sql3.="LEFT OUTER JOIN b01 ON b01.F01=b0d.F03 "; 
	$sql3.="LEFT OUTER JOIN a14 ON a14.F01=b01.F07 ";	  
	$sql3.="LEFT OUTER JOIN c04 ON c04.F01=b0d.F07 AND c04.F02=b0d.F03 ";	
	if(strlen($searchRecord)==0) {	  
        $sql3=$sql3."WHERE b0d.F01='".trim($shipno)."' AND c04.F09-c04.F24>0 ";		
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' AND b0d.F01='".trim($shipno)."' AND c04.F09-c04.F24>0 "; 
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$itemno=0;
	while ($list3=mysqli_fetch_array($sql4)){
		$itemno++; 
		$atr = array('item_no_IHC_000'=>$itemno, 
		             'stock_no_ISL_016'=>$list3['F03'],  		            	             
		             'stock_name_ISL_015'=>$list3['F0B'],
					 'order_no_ISL_012'=>$list3['F07'],					
					 'order_qty_ISR_010'=>$list3['avlq'],
					 'unit_price_ISR_010'=>$list3['F15'],
					 'custom_part_ISL_015'=>$list3['F08'],
					 'custom_po_ISL_012'=>$list3['F09'],
					 'depart_no_IHC_000'=>$list3['F0G'],
					 'depart_name_IHC_000'=>$list3['FZ2']
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
function getNeedBetween($kw1,$mark1,$mark2){  //抓取兩個字元間的字串函數
   $kw=$kw1; 
   $st =stripos($kw,$mark1);
   $ed =stripos($kw,$mark2);
   if(($st==false||$ed==false)||$st>=$ed)
      return 0;
   $kw=substr($kw,($st+1),($ed-$st-1));
return $kw;
}       
		 
 		 
          
?>  

 