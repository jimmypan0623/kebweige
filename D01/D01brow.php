<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");       //引用檔   
    $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       $rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
       $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數   
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `d01` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT d01.F00,d01.F01,d01.F03,d01.F04,d01.F12,d01.F06,d01.F11,d01.F19,d01.F05,d01.F21,d01.F08,
	   d01.F07,d01.F09,d01.F10,d01.F22,d01.F25,d00.F04 AS F0D,d01.F15,d01.F38,d01.F13,d01.F36,d01.F39,a01.F03 as F03A,d01.F16,
	   d01.F14,d01.F18 FROM `d01` 	  
	   LEFT OUTER JOIN `a01` ON d01.F39=a01.F01  	  
	   LEFT OUTER JOIN `d00` ON d00.F01=d01.F25  	  
	   order by d01.F01 ";	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	   
		$sql3="SELECT d01.F00,d01.F01,d01.F03,d01.F04,d01.F12,d01.F06,d01.F11,d01.F19,d01.F05,d01.F21,d01.F08,
	   d01.F07,d01.F09,d01.F10,d01.F22,d01.F25,d00.F04 AS F0D,d01.F15,d01.F38,d01.F13,d01.F36,d01.F39,a01.F03 as F03A,d01.F16,
	   d01.F14,d01.F18 FROM `d01`	   
	   LEFT OUTER JOIN `a01` ON d01.F39=a01.F01  
	   LEFT OUTER JOIN `d00` ON d00.F01=d01.F25  
		WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'vender_no'=>$list3['F01'], 					 
                     'vender_name'=>$list3['F03'],					                     
                     'vender_abbrv'=>$list3['F04'],  
                     'level'=>$list3['F12'],
                     'unitedno'=>$list3['F06'],                   
                     'product'=>$list3['F11'],					
                     'wayofship'=>$list3['F19'],      					 	
					
					 'address'=>$list3['F05'],
					 'addressoffactory'=>$list3['F21'],					 					 
					 
					 
					 'contact'=>$list3['F08'],	
					 'boss'=>$list3['F07'],		
					 'tel'=>$list3['F09'],		
                     'fax'=>$list3['F10'],	                  		
                     'email'=>$list3['F22'],	
					                  
                     'moneycrnt'=>$list3['F25'],	
					 'crntname'=>$list3['F0D'],	
                     'dayofincount'=>$list3['F15'],									 
                     'dayofcharge'=>$list3['F38'],	     					 
                     'wayofpay'=>$list3['F13'],		                   
                     'paymentterm'=>$list3['F36'],	                                 	                    
                     'procureno'=>$list3['F39'],
					 'procurename'=>$list3['F03A'],
                     
                    
                  				 
                     'remark'=>$list3['F16'],                     				 
                     'lasttrade'=>$list3['F14'],									 
                    
					 'lastupdate'=>$list3['F18']                      				 
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

 