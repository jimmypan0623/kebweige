<?php
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                              //引用檔
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
 
		$sql3="SELECT b0b.F01,b02.F90,b02.F02,b0b.F05,a14.F02 AS F0B,b0b.F04 FROM b0b,b02,a14 ";			  

	   	$sql3.=" WHERE b0b.F07='".$str[1]."' AND b0b.F03='".$str[0]."' AND b02.F01= b0b.F01 AND b02.F10!='Y' AND a14.F01=b0b.F05 order by b02.F90,b02.F02 DESC"; 
   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('ship_order'=>$list3['F01'],
		             'ship_date'=>($list3['F90'].'-'.$list3['F02']),
		             'dpt_no'=>$list3['F05'],  	
                     'dpt_name'=>$list3['F0B'],						                                         
					 'ship_qty'=>$list3['F04']);          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 


?>  

 