<?php
    header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");         //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入
	$searchRecord =$_POST['filename'];
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列	   		
	$sql3="SELECT a02.*,a03.F02,a03.F08 F0H,a03.F09 F0I,a03.F10 F1J,a03.F11 F1K,a03.F12 F1L FROM a02";
	$sql3.=" left outer join a03 on a03.F01=a02.F03 ";
	$sql3.="WHERE a02.F01='".$str[0]."' AND ".$str[1]." LIKE '%".trim($str[2])."%' ORDER BY F03 ";  
    $wthary=fldwdthpre('A02','2',$link);	
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){	 
	$atr = array('rc_no'.$wthary[0]=>$list3['F00'],
		             'prg_no'.$wthary[1]=>$list3['F03'], 
					 'prg_name'.$wthary[2]=>$list3['F02'], 
					 'new_auth'.$wthary[3]=>$list3['F04'],	                     
                     'edit_auth'.$wthary[4]=>$list3['F05'],
                     'del_auth'.$wthary[5]=>$list3['F06'],
					 'prnt_auth'.$wthary[6]=>$list3['F07'],
					 'auth1_attch'.$wthary[7]=>$list3['F08'],
					 'auth2_attch'.$wthary[8]=>$list3['F09'],
					 'auth3_attch'.$wthary[9]=>$list3['F10'],
					 'auth4_attch'.$wthary[10]=>$list3['F11'],
					 'auth5_attch'.$wthary[11]=>$list3['F12'],
					  'auth1_remark'.$wthary[12]=>$list3['F0H'],
					  'auth2_remark'.$wthary[13]=>$list3['F0I'],
					  'auth3_remark'.$wthary[14]=>$list3['F1J'],
					 'auth4_remark'.$wthary[15]=>$list3['F1K'],
                     'auth5_remark_'.$wthary[16]=>$list3['F1L'],
					  'lastupdate'.$wthary[17]=>$list3['F13']                  
					 );                          						 
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

 