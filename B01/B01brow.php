<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔
  
   
  // $sname=substr(strrchr($_POST['filename'],'|'),1);   //先抓科目名稱
   
   if (substr($_POST['filename'],0,3)=="PGE"){	  
       $pgeno=substr($_POST['filename'],3,3);  //控制頁次幾位元
	   //$sql="SELECT b01.F00,b01.F01,b01.F02,b01.F03,b01.F04,a14.F02 as F0B,b01.F07,b01.F10,b01.F12,b01.F13 FROM `b01`,`a14` WHERE  a14.F01=b01.F04 order by b01.F01 ";
	   $sql="SELECT b01.F00,b01.F01,b01.F02,b01.F03,b01.F04,b01.F06,b01.F98,b01.F03,b01.F04,b01.F05,
	   b01.F07,a14.F02 as F0B,b01.F07,b01.F10,b01.F11,b01.F41,b01.F97,b01.F28,b01.F31,b01.F39,b01.F30,b01.F38,b01.F37,b01.F21,b01.F29 FROM `b01` LEFT JOIN `a14` ON  a14.F01=b01.F07 order by b01.F01 ";
       //$sql="select * from q78 order by F01 desc"; 
	   $sql2=mysqli_query($link,$sql);
   	   $rows=@mysqli_num_rows($sql2);
	   $pagerows=12;  //每頁筆數
	   $total_pages=ceil($rows/$pagerows);
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows ; 
   }else{
	    $searchRecord =$_POST['filename'];
	    //$sql3="select * from q78 where ".$searchRecord." order by F01 desc"; 
		//$sql3="SELECT b01.F00,b01.F01,b01.F02,b01.F03,b01.F04,a14.F02 as F0B,b01.F07,b01.F10,b01.F12,b01.F13 FROM `b01`,`a14` WHERE a14.F01=b01.F07 AND ".$searchRecord." order by b01.F01 "; 
		$sql3="SELECT b01.F00,b01.F01,b01.F02,b01.F03,b01.F04,b01.F06,b01.F98,b01.F03,b01.F04,b01.F04,b01.F05,
		b01.F07,a14.F02 as F0B,b01.F07,b01.F10,b01.F11,b01.F41,b01.F97,b01.F28,b01.F31,b01.F39,b01.F30,b01.F38,b01.F37,b01.F21,b01.F29 FROM `b01` LEFT JOIN `a14` ON a14.F01=b01.F07 WHERE ".$searchRecord." order by b01.F01 "; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'stock_no'=>$list3['F01'], 					 
                     'stock_name'=>$list3['F02'],					                     
                     'tpemng'=>$list3['F06'],  
                     'tpblng'=>$list3['F98'],
                     'eachprchs'=>$list3['F03'],
                     'eachcount'=>$list3['F04'],  	
                     'dividing'=>$list3['F05'],
					 'dptno'=>$list3['F07'],
					 'dptname'=>$list3['F0B'],
					 'maxinv'=>$list3['F10'],
					 'minuminv'=>$list3['F11'],
					 'location'=>$list3['F41'],
					 'buildbom'=>$list3['F97'],
					 'prchsleadtime'=>$list3['F28'],
					 'warehousereadytime'=>$list3['F31'],					 
					 'tpeofaply'=>$list3['F39'],
					 'lotnomng'=>$list3['F30'],
					 'salescost'=>$list3['F38'],
					 'averagecost'=>$list3['F37'],
					 'remark'=>$list3['F29'],	
					 'lastupdate'=>$list3['F21']                     
					 );                      			
		array_push($arr,$atr);
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$total_pages));		 
         //echo "getProfile($json_string1,$total_pages)";  	   //
//接著建立一個排序的函數
     /*    function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }        */
		
		
		
		

?>  

 