<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");                              //引用檔   
   $rows=0;
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	    $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
        $rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
	    $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數         
	    $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	    if($total_pages<=1){
		    $sqlK="SELECT `F01` FROM `c04` WHERE `F03`-`F09`-`F21`>0 "; 
	        $sql2=mysqli_query($link,$sqlK);
   	        $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	        $total_pages=ceil($rows/$pagerows);
        }    
	 	   
	   $sql="SELECT c04.F00,c04.F02,b01.F02 AS F0B,c04.F01,c04.F06,c04.F03-c04.F09-c04.F21 AS NSH,c04.F23,c03.F03,c01.F05 As F0E,c04.F05,c03.F14,c03.F07,a01.F03 AS F0C,c04.F12,DATEDIFF(CURDATE( ),c04.F06) as diffdate FROM c04";
	   $sql.=" LEFT OUTER JOIN b01 ON b01.F01=c04.F02"; 
	   $sql.=" LEFT OUTER JOIN c03 ON c03.F01=c04.F01"; 
	   $sql.=" LEFT OUTER JOIN c01 ON c01.F01=c03.F03"; 
	   $sql.=" LEFT OUTER JOIN a01 ON a01.F01=c03.F07"; 
	   $sql.=" WHERE c04.F03-c04.F09-c04.F21 >0 AND c03.F04='Y' ORDER BY c04.F02,c04.F06";
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  	    
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);	 	    
	    $sql="SELECT c04.F00,c04.F02,b01.F02 AS F0B,c04.F01,c04.F06,c04.F03-c04.F09-c04.F21 AS NSH,c04.F23,c03.F03,c01.F05 As F0E,c04.F05,c03.F14,c03.F07,a01.F03 AS F0C,c04.F12,DATEDIFF(CURDATE( ),c04.F06) as diffdate FROM c04";
	    $sql.=" LEFT OUTER JOIN b01 ON b01.F01=c04.F02"; 
	    $sql.=" LEFT OUTER JOIN c03 ON c03.F01=c04.F01"; 
	    $sql.=" LEFT OUTER JOIN c01 ON c01.F01=c03.F03"; 
	    $sql.=" LEFT OUTER JOIN a01 ON a01.F01=c03.F07"; 
	    $sql3=$sql." WHERE ".$fieldNo." like '%".trim($filterKey)."%' AND c04.F03-c04.F09-c04.F21 >0 AND c03.F04='Y' order by ".$fieldNo.",c04.F06" ; 
    }	   
	$arr=array();	

    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		
		
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'stock_no'=>$list3['F02'], 
					 'stock_name'=>$list3['F0B'], 
                     'order_no'=>$list3['F01'],                     				                     				                                       
					 'shipdate'=>$list3['F06'],
					 'order_qty'=>$list3['NSH'], 
					 'readyship_qty'=>$list3['F23'], 	
					 'customer_no'=>$list3['F03'], 	
					 'customer_name'=>$list3['F0E'], 
					 'customer_partno'=>$list3['F05'], 
					  'customer_po'=>$list3['F14'], 
					 'sales_no'=>$list3['F07'], 
					 'sales_name'=>$list3['F0C'], 		
					 'diffdate'=>$list3['diffdate'], 			
					 'lastupdate'=>$list3['F12']                      				 
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

 