<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("include/mysqli_server.php");                              //引用檔
 
 
	    $searchRecord =$_POST['filename'];
		//$searchRecord=$_COOKIE['useraccount'];
	    $sql3="select a02.F03,a03.F02,a02.F04,a02.F05,a02.F06,a02.F07,a02.F08,a02.F09,a02.F10,a02.F11,a02.F12 from a02,a03 where a03.F01=a02.F03 and a02.F01=".$searchRecord." order by a02.F03"; 
	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('prg_no'=>$list3['F03'],
		             'dscrpt'=>$list3['F02'],
					 'newauth'=>$list3['F04'],
					 'editauth'=>$list3['F05'],
					 'delauth'=>$list3['F06'],
					 'pntauth'=>$list3['F07'],
				     'rmk1'=>$list3['F08'],
				     'rmk2'=>$list3['F09'],
					 'rmk3'=>$list3['F10'],
					 'rmk4'=>$list3['F11'],
					 'rmk5'=>$list3['F12']);                      						 
		array_push($arr,$atr);
	}
	
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
         $json_string1 = json_encode($arr); 		          		  
         echo "getProfile($json_string1)";  	   //
//接著建立一個排序的函數
        function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }       
?>  

 