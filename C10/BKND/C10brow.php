<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $rnddgt=intval($_COOKIE["INT_069"]);
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
		$sql3="SELECT c10.*,c01.F05 AS F0E,a01.F03 AS F0C FROM c10 		 
		LEFT OUTER JOIN c01 ON c01.F01=c10.F02
		LEFT OUTER JOIN a01 ON a01.F01=c10.F10 	
		WHERE c10.F90='".$pgeno."' ORDER BY c10.F01,c10.F03 ";  
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
        $sql3="SELECT c10.*,c01.F05 AS F0E,a01.F03 AS F0C FROM c10 		 
		LEFT OUTER JOIN c01 ON c01.F01=c10.F02
		LEFT OUTER JOIN a01 ON a01.F01=c10.F10 	
		WHERE c10.F90='".$pgeno."' AND ".$fieldNo." LIKE '%".trim($filterKey)."%' ORDER BY ".$fieldNo." ASC, c10.F01 DESC"  ;   
   }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_array($sql1);  //紀錄當前月份是否已結轉月庫存報表   
   
   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		
					 
		$atr = array('rc_no'=>$list3['F00'],  
                     'stock_no'=>$list3['F03'], 	
					 'bill_no'=>$list3['F04'], 	
					 'ship_date'=>$list3['F01'],
					 'recipt_no'=>$list3['F05'],  
					 'custom_no'=>$list3['F02'],	
					 'custom_name'=>$list3['F0E'],	
					 'ship_qty'=>$list3['F08'],
		             'unit_price'=>$list3['F07'], 					 
                     'crncy_type'=>$list3['F06'],	 
                     'crncy_rate'=>$list3['F09'],	 					 
                     'rcd_total'=>round($list3['F08']*$list3['F07']*$list3['F09'],$rnddgt),
					 'custom_po'=>$list3['F16'],  						
                     'sales_no'=>$list3['F10'],				
					  'sales_name'=>$list3['F0C'],	
					 'lastupdate'=>$list3['F19']                      				 
					 );                     			 
		array_push($arr,$atr);
		
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'transcode'=>$list4['F07']));		 
         //echo "getProfile($json_string1,$total_pages)";  	   //
//接著建立一個排序的函數
     /*    function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }        */
function getNeedBetween($kw1,$mark1,$mark2){  //抓取兩個字元間的字串函數
   $kw=$kw1; 
   $st =stripos($kw,$mark1);
   $ed =stripos($kw,$mark2);
   if(($st==false||$ed==false)||$st>=$ed)
      return 0;
   $kw=substr($kw,($st+1),($ed-$st-1));
return $kw;
}
?>  

 