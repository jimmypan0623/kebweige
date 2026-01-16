<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                      //引用檔 
     require_once "../../include/BKND/fieldpreset.php"; // 引入  
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select c02.*,c01.F05 as F0E from c02 left outer join c01 on c02.F01=c01.F44 where c01.F01= c01.F44 and c02.F03='".$str[0]."' and BINARY ".$str[1]." like '%".trim($str[2])."%' order by c02.F01"; 
	$wthary=fldwdthpre('B01','2',$link);  	                                                                     
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],		           
					 'customno_'.$wthary[1]=>$list3['F01'], 
					 'customname'.$wthary[2]=>$list3['F0E'],
					 'custom_partno'.$wthary[3]=>$list3['F04'],  
					 'crncy_type'.$wthary[4]=>$list3['F06'],	                     
                     'query_price'.$wthary[5]=>$list3['F07'],     					
                     'basic_pack'.$wthary[6]=>$list3['F13'],  		
                     'min_order'.$wthary[7]=>$list3['F08'],  	
					 'payment'.$wthary[8]=>$list3['F10'],
					 'query_no'.$wthary[9]=>$list3['F11'], 
					 'datestart'.$wthary[10]=>$list3['F02'],  
					 'dateline'.$wthary[11]=>$list3['F15'],  	
					 'remark'.$wthary[12]=>$list3['F16'],
                     'lastupdate'.$wthary[13]=>$list3['F99']);                      						 
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

 