<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                      //引用檔 
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列	 
		$sql3="select d02.*,d01.F04 as F0D from d02 left outer join d01 on d02.F01=d01.F01 where d02.F03='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by d02.F01"; 
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$atr = array('rc_no_DHC_000'=>$list3['F00'],		           
					 'vendorno_DSL_007'=>$list3['F01'], 
					 'vendorname_ISL_007'=>$list3['F0D'],
					 'vendor_partno_DSL_010'=>$list3['F04'],  
					 'crncy_type_DSC_004'=>$list3['F06'],	                     
                     'query_price_DSR_008'=>$list3['F07'],     					
                     'basic_pack_DSR_007'=>$list3['F13'],  		
                     'min_order_DSR_007'=>$list3['F08'],  	
					  'payment_DSL_010'=>$list3['F10'],
					 'lead_time_DSR_007'=>$list3['F11'], 
					 'datestart_DSC_010'=>$list3['F02'],  
					 'dateline_DSC_010'=>$list3['F15'],  		
					  'remark_DSL_010'=>$list3['F16'],
                     'lastupdate_DHC_000'=>$list3['F99']);                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
         //$json_string1 = json_encode($arr); 		
		echo json_encode(array ('recdrow'=>$arr,'pgttl'=>12));
		   
         //echo "getProfile($json_string1,$total_pages)";  	   //
//接著建立一個排序的函數
/*         function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }        */
?>  

 