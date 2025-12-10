<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次       
	    $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;      
	    $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	//每頁筆數  
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `c01` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT c01.F00,c01.F01,c01.F03,c01.F04,c01.F05,c01.F06,c01.F07,c01.F08,c01.F09,
	   c01.F10,c01.F11,c01.F12,c01.F13,c01.F14,c01.F15,c01.F16,c01.F17,c01.F19,c01.F20,c01.F21,c01.F22,c01.F23,a0B.F03 as F03B,c01.F25,c01.F26,c01.F29,c01.F30,c01.F31,
	   c01.F32,c01.F33,a0A.F03 as F03A,c01.F36,c01.F38,c01.F39,c00.F04 AS F0D,c01.F40,c01.F41,c01.F42,c01.F43,c01.F44 FROM `c01` 	  
	   LEFT OUTER JOIN `a01` AS a0A  ON c01.F33=a0A.F01  
	   LEFT OUTER JOIN `a01` AS a0B  ON c01.F23=a0B.F01  
	   LEFT OUTER JOIN `c00` ON c00.F01=c01.F39  
	   order by c01.F01 ";	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
   }else{
	    
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	   
		$sql3="SELECT c01.F00,c01.F01,c01.F03,c01.F04,c01.F05,c01.F06,c01.F07,c01.F08,c01.F09,
	   c01.F10,c01.F11,c01.F12,c01.F13,c01.F14,c01.F15,c01.F16,c01.F17,c01.F19,c01.F20,c01.F21,c01.F22,c01.F23,a0B.F03 as F03B,c01.F25,c01.F26,c01.F29,c01.F30,c01.F31,
	   c01.F32,c01.F33,a0A.F03 as F03A,c01.F36,c01.F38,c01.F39,c00.F04 as F0D,c01.F40,c01.F41,c01.F42,c01.F43,c01.F44 FROM `c01` 	  
	   LEFT OUTER JOIN `a01` AS a0A  ON c01.F33=a0A.F01  
	   LEFT OUTER JOIN `a01` AS a0B  ON c01.F23=a0B.F01  	
	   LEFT OUTER JOIN `c00` ON c00.F01=c01.F39  
		WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('rc_no_DHC_0000'=>$list3['F00'],  		            	             
		             'custom_no_DSL_0220'=>$list3['F01'], 					 
                     'custom_name_DSL_0780'=>$list3['F04'],					                     
                     'custom_abbrv_DHC_0000'=>$list3['F05'],  
                     'level_DHC_0000'=>$list3['F03'],
                     'unitedno_DHC_0000'=>$list3['F10'],
                     'typeofbusiness_DHC_0000'=>$list3['F43'],  
                     'product_DHC_0000'=>$list3['F21'],					 
					 'area_DHC_0000'=>$list3['F20'],										                           								
					 'invoicename_DHC_0000'=>$list3['F41'],					
					 'invoicepartno_DHC_0000'=>$list3['F42'],
					 'typeofinvoice_DHC_0000'=>$list3['F29'],	
                     'typeoftax_DHC_0000'=>$list3['F30'],	
					 'englishname_DHC_0000'=>$list3['F09'],
					 'address_DHC_0000'=>$list3['F06'],
					 'addressforship_DHC_0000'=>$list3['F07'],					 					 
					 'englishaddress_DHC_0000'=>$list3['F08'],
					 'indicateforship_DHC_0000'=>$list3['F32'],
					 'contact_DHC_0000'=>$list3['F12'],	
					 'boss_DHC_0000'=>$list3['F11'],		
					 'tel_DHC_0000'=>$list3['F13'],		
                     'fax_DHC_0000'=>$list3['F14'],	                  		
                     'email_DHC_0000'=>$list3['F22'],	
					  'groupno_DHC_0000'=>$list3['F44'],		                    
                     'moneycrnt_DHC_0000'=>$list3['F39'],	
					 'crntname_IHL_0000'=>$list3['F0D'],	
                     'dayofincount_DHC_0000'=>$list3['F17'],									 
                     'dayofcharge_DHC_0000'=>$list3['F38'],	     					 
                     'wayofpay_DHC_0000'=>$list3['F15'],		                   
                     'paymentterm_DHL_0000'=>$list3['F36'],	                                 	                    
                     'salesno_DHC_0000'=>$list3['F33'],
					 'salesname_IHL_0000'=>$list3['F03A'],
                     'assistantno_DHL_0000'=>$list3['F23'],	
					 'assistantname_IHC_0000'=>$list3['F03B'],	
                     'wayofship_DHL_0000'=>$list3['F31'],      
                      'receiver_DHL_0000'=>$list3['F40'],					 
                     'remark_DHC_0000'=>$list3['F25'],                     				 
                     'lasttrade_IHC_0000'=>$list3['F16'],									 
                     'lastquot_IHC_0000'=>$list3['F19'],	
					 'lastupdate_DHC_0000'=>$list3['F26']                      				 
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

 