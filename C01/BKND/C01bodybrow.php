<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                                 //引用檔
  require_once "../../include/BKND/fieldpreset.php"; // 引入       
	
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select c02.*,b01.F02 as F0B from c02 left outer join b01 on c02.F03=b01.F01 where c02.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by c02.F03"; 
	
   
	  $wthary=fldwdthpre('C01','2',$link);  
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],		           //_DHC_000
					 'stockno'.$wthary[1]=>$list3['F03'],                //_DSL_015
					 'stockname'.$wthary[2]=>$list3['F0B'],               //_ISL_015
					 'custom_partno'.$wthary[3]=>$list3['F04'],             //_DSL_015
					 'crncy_type'.$wthary[4]=>$list3['F06'],	             //_DSC_004          
                     'query_price'.$wthary[5]=>$list3['F07'],     			//_DSR_007	
                     'basic_pack'.$wthary[6]=>$list3['F13'],  		      //_DSR_007
                     'min_order'.$wthary[7]=>$list3['F08'],  	         //_DSR_007
					 'query_no'.$wthary[8]=>$list3['F11'],              //_DSL_010
					 'datestart'.$wthary[9]=>$list3['F02'],             //_DSC_008
					 'dateline'.$wthary[10]=>$list3['F15'],  			//_DSC_008
					  'remark'.$wthary[11]=>$list3['F16'],               //_DSL_010
                     'lastupdate'.$wthary[12]=>$list3['F99']);           //_DHC_000           						 
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

 