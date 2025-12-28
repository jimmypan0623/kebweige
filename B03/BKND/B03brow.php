<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT b03.F00,b03.F01,b03.F02,b03.F06,b03.F08,b03.F10,b03.F09,b03.F24,b03.F14,b03.F16,b03.F20,b03.F21,b03.F22,b03.F23,b03.F25,b03.F13,
	        d01.F04 as F0E,d01.F03 AS F0D,d01.F06 AS F1Z,d01.F08 AS F0H ,d01.F09 AS F1C,a01.F03 as F0C FROM b03 
	        left outer join d01 on d01.F01=b03.F06
            left outer join a01 on a01.F01=b03.F09 			
			WHERE b03.F90='".$pgeno."' ORDER BY b03.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
	 	$sql3="SELECT b03.F00,b03.F01,b03.F02,b03.F06,b03.F08,b03.F10,b03.F09,b03.F24,b03.F14,b03.F16,b03.F20,b03.F21,b03.F22,b03.F23,b03.F25,b03.F13,
	         d01.F04 as F0E,d01.F03 AS F0D,d01.F06 AS F1Z,d01.F08 AS F0H ,d01.F09 AS F1C,a01.F03 as F0C FROM b03 
	        left outer join d01 on d01.F01=b03.F06 
            left outer join a01 on a01.F01=b03.F09 	
		    WHERE b03.F90='".$pgeno."' and ".$fieldNo." like '%".trim($filterKey)."%' order by '".$fieldNo."', b03.F02"; 
    }	   
    $sql0="select * from a23 where F01='".$pgeno."'"; 
    $sql1=@mysqli_query($link,$sql0);                           
    $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表         
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('rc_no_DHL_000'=>$list3['F00'],  		            	             
		             'query_no_DSL_009'=>$list3['F01'], 					 
                     'custom_no_DSL_007'=>$list3['F06'],	
                     'custom_name_ISL_007'=>$list3['F0E'],	
                     'custom_fullname_IHL_000'=>$list3['F0D'],	
					 'unitedno_IHL_000'=>$list3['F1Z'],
					 'contact_IHL_000'=>$list3['F0H'],	
					 'tel_IHL_000'=>$list3['F1C'],		
                     'query_date_DSC_003'=>$list3['F02'],
                     'sales_no_DHL_000'=>$list3['F09'],		
					 'sales_name_ISL_007'=>$list3['F0C'],	
					 'orign_date_DSC_007'=>$list3['F08'],
					 'ship_bill_DSL_009'=>$list3['F21'],  	
					 'invoice_no_DSL_009'=>$list3['F20'],     	                                         				 
                     'invoice_type_DHC_000'=>$list3['F22'],     						                  
					 'tax_type_DHC_000'=>$list3['F23'],  					 									
					 'crncy_type_DSC_004'=>$list3['F14'],	
					 'crncy_rate_DSR_007'=>$list3['F16'],	
					 'discount_ship_DHC_000'=>$list3['F24'], 
					 'remark_DSL_009'=>$list3['F25'], 
                     'shure_IHC_000'=>$list3['F10'],     					 
					 'lastupdate_DHL_000'=>$list3['F13']                      				 
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

 