<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                                 //引用檔
  
    
  // $sname=substr(strrchr($_POST['filename'],'|'),1);   //先抓科目名稱
   
   if (substr($_POST['filename'],0,3)=="PGE"){	  
       $pgeno=substr($_POST['filename'],3,3);   	  
       $sql="select * from a14 order by F01 ";  
	   $sql2=mysqli_query($link,$sql);
   	   $rows=@mysqli_num_rows($sql2);
	   $pagerows=15;  //每頁筆數
	   $total_pages=ceil($rows/$pagerows);
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows ; 
   }else{
	    $searchRecord =$_POST['filename'];
	    $sql3="select * from a14 where ".$searchRecord." order by F01"; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],
		             'dpt_no'=>$list3['F01'], 
					 'dpt_name'=>$list3['F02'],	                     
                     'inv_inc'=>$list3['F04'],
                     'prod_inc'=>$list3['F05'],
					 'cost_inc'=>$list3['F13'],
					 'remark'=>$list3['F06'],
                     'belong_to'=>$list3['F12']);                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
         $json_string1 = json_encode($arr); 		          		  
         echo "getProfile($json_string1,$total_pages)";  	   //
//接著建立一個排序的函數
/*         function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }        */
?>  

 