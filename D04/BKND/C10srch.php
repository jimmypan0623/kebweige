<?php
 header("Content-Type:text/html; charset=utf-8");   
 include("../../include/BKND/mysqli_server.php");                               //引用檔
    $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	$sql3="SELECT c10.F90,c10.F01,c10.F04,c10.F08 FROM c10 WHERE c10.F05='".$str[0]."' AND c10.F03='".$str[1]."'  ORDER BY CONCAT(c10.F90,c10.F01) DESC";                                                                    
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('ship_date'=>($list3['F90'].'-'.$list3['F01']),		           
					 'bill_no'=>$list3['F04'], 
					 'ship_qty'=>$list3['F08']);					 						 
        array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
?>  

 