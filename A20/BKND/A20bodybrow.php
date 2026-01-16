<?php
   header("Content-Type:text/html; charset=utf-8");   

    include("../../include/BKND/mysqli_server.php");                      //引用檔 
    require_once "../../include/BKND/fieldpreset.php"; // 引入  
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select a22.* from a22 where F05='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by F01"; 
	$wthary=fldwdthpre('A20','2',$link);	                                                                     
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],
		             'field_no'.$wthary[1]=>$list3['F01'], 
					 'field_name'.$wthary[2]=>$list3['F06'], 
					 'field_type'.$wthary[3]=>$list3['F02'],	                     
                     'field_length'.$wthary[4]=>$list3['F03'],     
					 'decimlth'.$wthary[5]=>$list3['F04'],  
					 'defaultvalue'.$wthary[6]=>$list3['F07'],
                     'lastupdate'.$wthary[7]=>$list3['F20']);                      						 
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

 