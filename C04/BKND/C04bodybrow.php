<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                                //引用檔
      $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select c04.*,b01.F02 as F0B from c04 left outer join b01 on c04.F02=b01.F01 where c04.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by c04.F02"; 
		                                                                     
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],		           
					 'stockno'=>$list3['F02'], 
					 'stockname'=>$list3['F0B'],
					 'query_qty'=>$list3['F03'],	                     
                     'query_price'=>$list3['F04'],     
					 'custom_partno'=>$list3['F05'],  
                     'hopedate'=>$list3['F06'],  		
                     'already'=>$list3['F09'],  				
					 'beencancel'=>$list3['F21'],  	
                     'notout'=>$list3['F23'],					 
                     'lastupdate'=>$list3['F12']);                      						 
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

 