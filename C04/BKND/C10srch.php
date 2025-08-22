<?php
 header("Content-Type:text/html; charset=utf-8");   
 include("../../include/BKND/mysqli_server.php");                               //引用檔
    $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	$sql3="SELECT b04.F90,b04.F02,b0d.F01,b0d.F04 FROM b0d,b04 WHERE b04.F01=b0d.F01 AND b0d.F07='".$str[0]."' AND b0d.F03='".$str[1]."'  ORDER BY CONCAT(b04.F90,b04.F02) DESC";                                                                    
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){		 
		$atr = array('ship_date'=>($list3['F90'].'-'.$list3['F02']),		           
					 'bill_no'=>$list3['F01'], 
					 'ship_qty'=>$list3['F04']);					 						 
        array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
?>  

 