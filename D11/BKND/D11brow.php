<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $rnddgt=intval($_COOKIE["INT_069"]);
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
		$sql3="SELECT d11.*,d01.F04 AS F0E,a01.F03 AS F0C,a14.F02 AS F0D FROM d11 		 
		LEFT OUTER JOIN d01 ON d01.F01=d11.F02
		LEFT OUTER JOIN a01 ON a01.F01=d11.F10 	
		LEFT OUTER JOIN a14 ON a14.F01=d11.F15
		WHERE d11.F90='".$pgeno."' ORDER BY d11.F01,d11.F03 ";  
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
        $sql3="SELECT d11.*,d01.F04 AS F0E,a01.F03 AS F0C,a14.F02 AS F0D FROM d11 		 
		LEFT OUTER JOIN d01 ON d01.F01=d11.F02
		LEFT OUTER JOIN a01 ON a01.F01=d11.F10 	
		LEFT OUTER JOIN a14 ON a14.F01=d11.F15
		WHERE d11.F90='".$pgeno."' AND ".$fieldNo." LIKE '%".trim($filterKey)."%' ORDER BY ".$fieldNo." ASC, d11.F01 DESC"  ;   
    }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表   
   
   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('rc_no_DHL_000'=>$list3['F00'],  
                     'stock_no_DSL_012'=>$list3['F03'], 	
					 'bill_no_DSL_010'=>$list3['F04'], 	
					 'ship_date_DSC_003'=>$list3['F01'],
					 'recipt_no_DSL_010'=>$list3['F05'],  
					 'custom_no_DSL_007'=>$list3['F02'],	
					 'custom_name_ISL_007'=>$list3['F0E'],	
					 'ship_qty_DSR_007'=>$list3['F08'],
		             'unit_price_DSR_007'=>$list3['F07'], 					 
                     'crncy_type_DSC_004'=>$list3['F06'],	 
                     'crncy_rate_DSR_007'=>$list3['F09'],	 					 
                     'rcd_total_DSR_008'=>round($list3['F08']*$list3['F07']*$list3['F09'],$rnddgt),
					 'depart_no_DHL_000'=>$list3['F15'],				
					  'depart_name_ISL_007'=>$list3['F0D'],						
                     'sales_no_DHL_000'=>$list3['F10'],				
					  'sales_name_ISL_007'=>$list3['F0C'],	
					   'sending_bill_DSL_010'=>$list3['F16'],  	
					  'vendor_partno_DSL_012'=>$list3['F17'],  	
					 'lastupdate_DHL_000'=>$list3['F19']                      				 
					 );                     			 
		array_push($arr,$atr);
		
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'transcode'=>$list4['F07']));		 
         //echo "getProfile($json_string1,$total_pages)";  	   //
//接著建立一個排序的函數
     /*    function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }        */
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

 