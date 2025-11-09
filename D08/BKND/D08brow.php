<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                     //引用檔   
   $rows=0;
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	    $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
        //$rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
		 $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;
	    //$pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數   
		$pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
	    $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	    if($total_pages<=1){
		    $sqlK="SELECT `F01` FROM `d04` WHERE `F03`-`F09`-`F21`>0 "; 
	        $sql2=mysqli_query($link,$sqlK);
   	        $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	        $total_pages=ceil($rows/$pagerows);
        }    	 	   
	    $sql="SELECT `d04`.`F00`,`d04`.`F02`,`b01`.`F02` AS `F0B`,`d04`.`F01`,`d04`.`F06`,`d04`.`F03`-`d04`.`F09`-`d04`.`F21` AS NSH,`d04`.`F23`,`d03`.`F03`,`d01`.`F04` As F0D,`d04`.`F05`,`d03`.`F14`,`d03`.`F07`,`a01`.`F03` AS F0C,`d04`.`F12`,DATEDIFF(CURDATE( ),`d04`.`F06`) AS diffdate FROM `d04`";
	    $sql.=" LEFT JOIN `b01` ON `b01`.`F01`=`d04`.`F02`"; 
	    $sql.=" LEFT JOIN `d03` ON `d03`.`F01`=`d04`.`F01`"; 
	    $sql.=" LEFT JOIN `d01` ON `d01`.`F01`=`d03`.`F03`"; 
	    $sql.=" LEFT JOIN `a01` ON `a01`.`F01`=`d03`.`F07`"; 
	    $sql.=" WHERE `d04`.`F03`-`d04`.`F09`-`d04`.`F21` >0 AND `d03`.`F04`='Y' ORDER BY `d04`.`F02`,`d04`.`F06`";
	    $start_rowrecord=$pagerows*($pgeno-1);	
	    $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  	        
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);	 	    
	    $sql="SELECT `d04`.`F00`,`d04`.`F02`,`b01`.`F02` AS F0B,`d04`.`F01`,`d04`.`F06`,`d04`.`F03`-`d04`.`F09`-`d04`.`F21` AS NSH,`d04`.`F23`,`d03`.`F03`,`d01`.`F04` As F0D,`d04`.`F05`,`d03`.`F14`,`d03`.`F07`,`a01`.`F03` AS F0C,`d04`.`F12`,DATEDIFF(CURDATE( ),`d04`.`F06`) AS diffdate FROM `d04`";
	    $sql.=" LEFT JOIN `b01` ON `b01`.`F01`=`d04`.`F02`"; 
	    $sql.=" LEFT JOIN `d03` ON `d03`.`F01`=`d04`.`F01`"; 
	    $sql.=" LEFT JOIN `d01` ON `d01`.`F01`=`d03`.`F03`"; 
	    $sql.=" LEFT JOIN `a01` ON `a01`.`F01`=`d03`.`F07`"; 
	    $sql3=$sql." WHERE ".$fieldNo." like '%".trim($filterKey)."%' AND `d04`.`F03`-`d04`.`F09`-`d04`.`F21` >0 AND `d03`.`F04`='Y' order by ".$fieldNo.",`d04`.`F06`" ; 
	}	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$atr = array('rc_no_DHL_000'=>$list3['F00'],  		            	             
		             'stock_no_DSL_013'=>$list3['F02'], 
					 'stock_name_ISL_013'=>$list3['F0B'], 
                     'order_no_DSL_010'=>$list3['F01'],                     				                     				                                       
					 'shipdate_DSL_010'=>$list3['F06'],
					 'order_qty_DSR_007'=>$list3['NSH'], 
					 'readyship_qty_IHR_007'=>$list3['F23'], 	
					 'customer_no_DSL_007'=>$list3['F03'], 	
					 'customer_name_ISL_007'=>$list3['F0D'], 
					 'customer_partno_DSL_013'=>$list3['F05'], 
					  'customer_po_DSL_013'=>$list3['F14'], 
					 'sales_no_DHL_000'=>$list3['F07'], 
					 'sales_name_DSL_007'=>$list3['F0C'], 		
					 'diffdate_IHL_000'=>$list3['diffdate'], 			
					 'lastupdate_DHL_000'=>$list3['F12']                      				 
					 );                      			
		array_push($arr,$atr);
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$rows));		 
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

 