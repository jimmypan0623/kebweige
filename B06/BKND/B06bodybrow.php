<?php
   header("Content-Type:text/html; charset=utf-8");   

  require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
  require_once "../../include/BKND/fieldpreset.php"; // 引入         
		 
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="SELECT b0f.*,b01.F02 AS F0B FROM b0f"; 
		$sql3.=" LEFT OUTER JOIN b01 on b0f.F03=b01.F01";
		$sql3.=" where b0f.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by b0f.F03"; 
	 $wthary=fldwdthpre('B06','2',$link); 	 	 	                                                              
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],		           
					 'stockno'.$wthary[1]=>$list3['F03'], 
					 'stockname'.$wthary[2]=>$list3['F0B'],					
					 'query_qty'.$wthary[3]=>$list3['F04'],	                                         
					 'remark'.$wthary[4]=>$list3['F25'],
                     'lastupdate'.$wthary[5]=>$list3['F11']);                      						 
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

 