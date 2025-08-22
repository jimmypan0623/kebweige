<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
         
		 
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select b0e.*,b01.F02 as F0B,a14.F02 as F0C from `b0e`"; 
		$sql3.=" left outer join b01 on b0e.F03=b01.F01";
		$sql3.=" left outer join a14 on b0e.F05=a14.F01 "; 		
		$sql3.=" where b0e.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by b0e.F03"; 
		                                                              
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],		           
					 'stockno'=>$list3['F03'], 
					 'stockname'=>$list3['F0B'],
					  'order_no'=>$list3['F07'], 
					 'query_qty'=>$list3['F04'],	                     
                     'query_price'=>$list3['F15'],                         	
					 'dept_no'=>$list3['F05'],
					 'dept_name'=>$list3['F0C'],
					 'custom_partno'=>$list3['F08'],  
                     'custom_po'=>$list3['F09'],  	
					 'ship_date'=>$list3['F12'],  	
                     'lastupdate'=>$list3['F11']);                      						 
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

 