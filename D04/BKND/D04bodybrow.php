<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                                //引用檔
  require_once "../../include/BKND/fieldpreset.php"; // 引入  
      $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列	   
		$sql3="SELECT d04.*,b01.F02 AS F0B FROM d04 LEFT OUTER JOIN b01 ON d04.F02=b01.F01 WHERE d04.F01='".$str[0]."' AND ".$str[1]." LIKE '%".trim($str[2])."%' ORDER BY d04.F02"; 		                                                                     
	 $wthary=fldwdthpre('D04','2',$link);
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],		           
					 'stockno'.$wthary[1]=>$list3['F02'], 
					 'stockname'.$wthary[2]=>$list3['F0B'],
					 'query_qty'.$wthary[3]=>$list3['F03'],	                     
                     'query_price'.$wthary[4]=>$list3['F04'],     
					 'custom_partno'.$wthary[5]=>$list3['F05'],  
                     'hopedate'.$wthary[6]=>$list3['F06'],  		
                     'already'.$wthary[7]=>$list3['F09'],  		//已出數量		
					 'beencancel'.$wthary[8]=>$list3['F21'],  	    //取消數量
                     'notout'.$wthary[9]=>$list3['F23'],			//開單未出		 
                     'lastupdate'.$wthary[10]=>$list3['F12']);                      						 
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

 