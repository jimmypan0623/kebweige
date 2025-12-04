<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");      //引用檔   
   $rnddgt=intval($_COOKIE["INT_068"]);
   $str=explode('|',$_POST['keyfield']);  //將上面字串以|號分割成陣列
 
	$sql3="SELECT * FROM `d19` WHERE `F03`='".$str[0]."' AND `F90`='".$str[1]."' ORDER BY `F01`,`F02`,`F05` ";	 
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array( 
		             'ship_date_DSL_008'=>$list3['F01'],
					 'invoice_no_DSL_008'=>$list3['F17'],
                     'stock_no_DSL_012'=>$list3['F05'], 	
					 'bill_no_DSL_008'=>$list3['F02'], 			 
					 'ship_qty_DSR_007'=>$list3['F06'],
		             'unit_price_DSR_007'=>$list3['F07'], 					 
                     'crncy_type_DSC_004'=>$list3['F13'],	 
                     'crncy_rate_DSR_007'=>$list3['F14'],	 					 
                     'rcd_total_DSR_008'=>round($list3['F06']*$list3['F07']*$list3['F14'],$rnddgt),
                  	 'sending_bill_DSL_009'=>$list3['F04'],	 
					 'vendor_partno_DSL_011'=>$list3['F08'] 	
					 );                     			 
		array_push($arr,$atr);
		
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr));		 
         //echo "getProfile($json_string1,$total_pages)";  	   //

?>  

 