<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
         
		 
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select k0h.* from `k0h`"; 
	  //  $sql3.=" where k0h.F01='".$str[0]."' ";
		$sql3.=" where k0h.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by k0h.F03"; 
		                                                              
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$atr = array('rc_no_DHL_000'=>$list3['F00'],		           
					  'bill_no_DSL_012'=>$list3['F03'], 
					 'invoice_no_DSL_012'=>$list3['F02'],	                     
                     'ship_date_DSC_012'=>$list3['F14'],                         	
					 'origin_fee_DSR_012'=>$list3['F04'],  
                     'reduce_number_DSR_012'=>$list3['F05'],  	
					 'ship_remark_DSL_014'=>$list3['F12'],  	
                     'lastupdate_DSC_012'=>$list3['F11']);                      						 
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

 