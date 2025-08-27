<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT b05.F00,b05.F01,b05.F02,b05.F06,b05.F08,b05.F10,b05.F09,b05.F24,b05.F14,b05.F16,b05.F20,b05.F21,b05.F22,b05.F23,b05.F13,
	        c01.F05 as F0E,c01.F04 AS F0D,c01.F10 AS F1Z,c01.F12 ,c01.F13 AS F1C,a01.F03 as F0C FROM b05 
	        left outer join c01 on c01.F01=b05.F06
            left outer join a01 on a01.F01=b05.F09 			
			WHERE b05.F90='".$pgeno."' ORDER BY b05.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
	 	$sql3="SELECT b05.F00,b05.F01,b05.F02,b05.F06,b05.F08,b05.F10,b05.F09,b05.F24,b05.F14,b05.F16,b05.F20,b05.F21,b05.F22,b05.F23,b05.F13,
	         c01.F05 as F0E,c01.F04 AS F0D,c01.F10 AS F1Z,c01.F12 ,c01.F13 AS F1C,a01.F03 as F0C FROM b05 
	        left outer join c01 on c01.F01=b05.F06 
            left outer join a01 on a01.F01=b05.F09 	
		    WHERE b05.F90='".$pgeno."' and ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo." b05.F02"; 
   }	   
   $sql0="select * from a23 where F01='".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_array($sql1);  //紀錄當前月份是否已結轉月庫存報表   
   
   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'query_no'=>$list3['F01'], 					 
                     'custom_no'=>$list3['F06'],	
                     'custom_name'=>$list3['F0E'],	
                     'custom_fullname'=>$list3['F0D'],	
					 'unitedno'=>$list3['F1Z'],
					 'contact'=>$list3['F12'],	
					 'tel'=>$list3['F1C'],		
                     'query_date'=>$list3['F02'],
                     'sales_no'=>$list3['F09'],		
					 'sales_name'=>$list3['F0C'],	
					 'orign_date'=>$list3['F08'],
					 'ship_bill'=>$list3['F21'],  	
					 'invoice_no'=>$list3['F20'],     	                                         				 
                     'invoice_type'=>$list3['F22'],     						                  
					 'tax_type'=>$list3['F23'],  					 									
					 'crncy_type'=>$list3['F14'],	
					 'crncy_rate'=>$list3['F16'],	
					 'discount_ship'=>$list3['F24'], 
                     'shure'=>$list3['F10'],     					 
					 'lastupdate'=>$list3['F13']                      				 
					 );                      			
		array_push($arr,$atr);
	}
	mysqli_close($link);
	
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$list4['F07']));		 //($list4['F07']=='Y'?1:0))
		 
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

 