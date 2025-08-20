<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔

       $rndnb=$_COOKIE['INT_001'];  //參數設定的小數位數
    
	    $searchRecord =$_POST['filename'];
		 $sql3="SELECT b11.F01,a14.F02,b11.F03,b11.F04,b11.F05,b11.F06,DATEDIFF(CURDATE( ),b11.F05) as diffdate FROM b11 LEFT OUTER JOIN a14 ON a14.F01=b11.F01 WHERE b11.F04!=0 and b11.F03='".$searchRecord."' ORDER BY b11.F01 DESC";
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('dpt_no'=>$list3['F01'],  	
                       'dpt_name'=>$list3['F02'],						   
                     'stock_qty'=>round($list3['F04'],$rndnb),
                     'last_update'=>$list3['F05'],					                    		
					 'apply'=>$list3['F06'],
					 'diffdate'=>$list3['diffdate']);          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 