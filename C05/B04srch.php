<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
 
		$sql3="SELECT b0d.F01,b04.F90,b04.F02,B0d.F05,a14.F02 AS F0B,b0d.F04 FROM b0d,b04,a14 ";			  

	   	$sql3.=" WHERE b0d.F07='".$str[1]."' AND b0d.F03='".$str[0]."' AND b04.F01= b0d.F01 AND b04.F10!='Y' AND a14.F01=b0d.F05 order by b04.F90,b04.F02 "; 
   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){		 
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
	 
        // echo "srchStockNo($json_string1)";    
       
		 

?>  

 