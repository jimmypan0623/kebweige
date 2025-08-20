<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
 
		$sql3="SELECT * FROM b26 ";			  

	   	$sql3.=" WHERE b26.F02='".$str[1]."' AND b26.F01='".$str[0]."'  AND F90='".$str[2]."' order by b26.F03,b26.F07 "; 
    
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){	
	   $str[3]=$str[3]+$list3['F04'];
		$atr = array('ship_date'=>$list3['F90'].'-'.$list3['F03'] ,
		             'order_type'=>$list3['F06'] ,
		             'ship_order'=>$list3['F07'],
		              'ship_qty'=>$list3['F04'], 
					  'calc_qty'=>$str[3], 
		             'remark'=>$list3['F08']);          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
	 
        // echo "srchStockNo($json_string1)";    
       
		 

?>  

 