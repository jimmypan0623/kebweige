<?php
   header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
    $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key		
	$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 
	$vendorno=trim(substr(strrchr($_POST['filename'],'_'),1));   //廠商編號		 
	$searchRecord =trim($filterKey);		
	$sql3="SELECT b01.F01,b01.F02,b01.F04,c20.F03,c20.F15,d34.F03 AS F0C FROM b01 ";	 
	$sql3.="LEFT OUTER JOIN c20 on c20.F01=b01.F01 ";
	$sql3.="LEFT OUTER JOIN d34 on d34.F02=b01.F01 and d34.F01='".$vendorno."' ";	
	if(strlen($searchRecord)==0) {	  
         $sql3=$sql3."WHERE left(F98,1)='Y' ";		
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".$searchRecord."%' AND (LEFT(F98,1)='Y' ) "   ; 
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('stock_no_ISL_030'=>$list3['F01'],  		            	             
		             'stock_name_ISL_040'=>$list3['F02'],
					 'unit_name_IHL_000'=>$list3['F04'],
					 'basic_qty_IHL_000'=>$list3['F03'],
					 'minum_qty_IHL_000'=>$list3['F15'],
					 'custom_part_ISL_030'=>$list3['F0C']
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

 