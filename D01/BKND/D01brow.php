<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");        //引用檔   
   require_once "../../include/BKND/fieldpreset.php"; // 引入  
    $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       //$rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
	   $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;
       //$pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數   
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
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
    $wthary=fldwdthpre('D01','1',$link); 
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  		            	             
		             'vender_no'.$wthary[1]=>$list3['F01'], 					 
                     'vender_name'.$wthary[2]=>$list3['F03'],					                     
                     'vender_abbrv'.$wthary[3]=>$list3['F04'],  
                     'level'.$wthary[4]=>$list3['F12'],
                     'unitedno'.$wthary[5]=>$list3['F06'],                   
                     'product'.$wthary[6]=>$list3['F11'],					
                     'wayofship'.$wthary[7]=>$list3['F19'],      					 						
					 'address'.$wthary[8]=>$list3['F05'],
					 'addressoffactory'.$wthary[9]=>$list3['F21'],					 					 					 					 
					 'contact'.$wthary[10]=>$list3['F08'],	
					 'boss'.$wthary[11]=>$list3['F07'],		
					 'tel'.$wthary[12]=>$list3['F09'],		
                     'fax'.$wthary[13]=>$list3['F10'],	                  		
                     'email'.$wthary[14]=>$list3['F22'],						                  
                     'moneycrnt'.$wthary[15]=>$list3['F25'],	
					 'crntname'.$wthary[16]=>$list3['F0D'],	
                     'dayofincount'.$wthary[17]=>$list3['F15'],									 
                     'dayofcharge'.$wthary[18]=>$list3['F38'],	     					 
                     'wayofpay'.$wthary[19]=>$list3['F13'],		                   
                     'paymentterm'.$wthary[20]=>$list3['F36'],	                                 	                    
                     'procureno'.$wthary[21]=>$list3['F39'],
					 'procurename'.$wthary[22]=>$list3['F03A'],
                     'remark'.$wthary[23]=>$list3['F16'],                     				 
                     'lasttrade'.$wthary[24]=>$list3['F14'],									                     
					 'lastupdate'.$wthary[25]=>$list3['F18']                      				 
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

 