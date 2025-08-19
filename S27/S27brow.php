<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔
  
   
  // $sname=substr(strrchr($_POST['filename'],'|'),1);   //先抓科目名稱
   
   if (substr($_POST['filename'],0,3)=="PGE"){	  
       $pgeno=substr($_POST['filename'],3,3);  //控制頁次幾位元
	   $sql="SELECT s27.F00,s27.F0C,s27.F01,s27.F0B,a14.F02,a01.F03,s27.F04,s27.F05,s27.F06,s27.F07,s27.F08 FROM `s27`,`a14`,`a01` WHERE a01.F01=s27.F0C AND a14.F01=a01.F04 order by s27.F00 desc";
       //$sql="select * from q78 order by F01 desc"; 
	   $sql2=mysqli_query($link,$sql);
   	   $rows=@mysqli_num_rows($sql2);
	   $pagerows=15;  //每頁筆數
	   $total_pages=ceil($rows/$pagerows);
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows ; 
   }else{
	    $searchRecord =$_POST['filename'];
	    //$sql3="select * from q78 where ".$searchRecord." order by F01 desc"; 
		$sql3="SELECT s27.F00,s27.F0C,s27.F01,s27.F0B,a14.F02,a01.F03,s27.F04,s27.F05,s27.F06,s27.F07,s27.F08 FROM `s27`,`a14`,`a01` WHERE a01.F01=s27.F0C AND a14.F01=a01.F04 AND ".$searchRecord." order by s27.F00 desc"; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  
		            	             
		             'lve_dt'=>$list3['F01'], 
					 'lve_tm'=>$list3['F0B'],	
                     'dpt_name'=>$list3['F02'],
					 'acc_no'=>$list3['F0C'],	
                     'stf_name'=>$list3['F03'],
                     'lve_rsn'=>$list3['F04'],
                     'lve_for'=>$list3['F05'],	
                     'tch_man'=>$list3['F06'],	
					 'tel_no'=>$list3['F07'],	
					 'bck_tm'=>$list3['F08']);                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
         //$json_string1 = json_encode($arr); 		      
        echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$total_pages));		 
         //echo "getProfile($json_string1,$total_pages)";  	   //
		
//接著建立一個排序的函數
        function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }       
?>  

 