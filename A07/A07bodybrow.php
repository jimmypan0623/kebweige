<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                                 //引用檔
  
    
  // $sname=substr(strrchr($_POST['filename'],'|'),1);   //先抓科目名稱
   
  /*  if (substr($_POST['filename'],0,3)=="PGE"){	  
       $pgeno=substr($_POST['filename'],3,3);   	  
       $sql="select * from a02,a03 order by F03 where a03.F01=a02.F03";  
	   $sql2=mysqli_query($link,$sql);
   	   $rows=@mysqli_num_rows($sql2);
	   $pagerows=15;  //每頁筆數
	   $total_pages=ceil($rows/$pagerows);
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows ; 
   }else{ */
	    $searchRecord =$_POST['filename'];
	    $sql3="select a02.*,a03.F02,a03.F08 F0H,a03.F09 F0I,a03.F10 F1J,a03.F11 F1K,a03.F12 F1L from a02,a03 where a03.F01=a02.F03 and ".$searchRecord." order by F03"; 
		//select a02.*,a03.F02,a03.F08 F0H,a03.F09 F0I,a03.F10 F1J,a03.F11 F1K,a03.F12 F1L from a02,a03 where a03.F01=a02.F03 and  a02.F01='JIMMY' order by a02.F03
   //}	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],
		             'prg_no'=>$list3['F03'], 
					 'prg_name'=>$list3['F02'], 
					 'new_auth'=>$list3['F04'],	                     
                     'edit_auth'=>$list3['F05'],
                     'del_auth'=>$list3['F06'],
					 'prnt_auth'=>$list3['F07'],
					 'auth1_attch'=>$list3['F08'],
					 'auth2_attch'=>$list3['F09'],
					 'auth3_attch'=>$list3['F10'],
					 'auth4_attch'=>$list3['F11'],
					 'auth5_attch'=>$list3['F12'],
					  'auth1_remark'=>$list3['F0H'],
					  'auth2_remark'=>$list3['F0I'],
					  'auth3_remark'=>$list3['F1J'],
					 'auth4_remark'=>$list3['F1K'],
                     'attch5_remark'=>$list3['F1L']);                      						 
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

 