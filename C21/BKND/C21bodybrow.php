<?php
   header("Content-Type:text/html; charset=utf-8");   
 include("../../include/BKND/mysqli_server.php");                                //引用檔
  require_once "../../include/BKND/fieldpreset.php"; // 引入      
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select c27.*,b01.F02 as F0B from c27 left outer join b01 on c27.F02=b01.F01 where c27.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by c27.F02"; 
	$wthary=fldwdthpre('C21','2',$link);  	                                                                     
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],		          //_DHL_000 
					 'stockno'.$wthary[1]=>$list3['F02'],       //_DSL_013
					 'stockname'.$wthary[2]=>$list3['F0B'],     //_ISL_013
					 'query_qty'.$wthary[3]=>$list3['F03'],	      //_DSR_008               
                     'query_price'.$wthary[4]=>$list3['F04'],        //_DSR_008
					 'custom_partno'.$wthary[5]=>$list3['F05'],      //_DSL_013
                     'basic_pack'.$wthary[6]=>$list3['F06'],  		  //_DSR_007
                     'min_order'.$wthary[7]=>$list3['F07'],  			//_DSR_007	
					 'datestart'.$wthary[8]=>$list3['F15'],          //_DSC_010
					 'dateline'.$wthary[9]=>$list3['F17'],  			//_DSC_010
                     'lastupdate'.$wthary[10]=>$list3['F99']);           //_DHL_000           						 
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

 