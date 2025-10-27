<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                                //引用檔
      $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select c04.*,b01.F02 as F0B from c04 left outer join b01 on c04.F02=b01.F01 where c04.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by c04.F02"; 
		                                                                     
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('rc_no_DHL_000'=>$list3['F00'],		           
					 'stockno_DSL_013'=>$list3['F02'], 
					 'stockname_ISL_013'=>$list3['F0B'],
					 'query_qty_DSR_008'=>$list3['F03'],	                     
                     'query_price_DSR_008'=>$list3['F04'],     
					 'custom_partno_DSL_013'=>$list3['F05'],  
                     'hopedate_DSC_010'=>$list3['F06'],  		
                     'already_ISR_008'=>$list3['F09'],  		//已出數量		
					 'beencancel_ISR_008'=>$list3['F21'],  	    //取消數量
                     'notout_IHR_000'=>$list3['F23'],			//開單未出		 
                     'lastupdate_DHL_000'=>$list3['F12']);                      						 
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

 