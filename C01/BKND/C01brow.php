<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   require_once "../../include/BKND/fieldpreset.php"; // 引入      
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
   
  
      $wthary=fldwdthpre('C01','1',$link);  
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  		       //_DHC_0000     	             
		             'custom_no'.$wthary[1]=>$list3['F01'], 			//_DSC_025		 
                     'custom_name'.$wthary[2]=>$list3['F04'],	          //_DSL_075			                     
                     'custom_abbrv'.$wthary[3]=>$list3['F05'],      //_DHC_000
                     'level'.$wthary[4]=>$list3['F03'],             //_DHC_000
                     'unitedno'.$wthary[5]=>$list3['F10'],            //_DHC_000
                     'typeofbusiness'.$wthary[6]=>$list3['F43'],      //_DHC_000
                     'product'.$wthary[7]=>$list3['F21'],				//_DHC_000	 
					 'area'.$wthary[8]=>$list3['F20'],					//_DHC_000					                           								
					 'invoicename'.$wthary[9]=>$list3['F41'],				//_DHC_000	
					 'invoicepartno'.$wthary[10]=>$list3['F42'],      //_DHC_000
					 'typeofinvoice'.$wthary[11]=>$list3['F29'],	     //_DHC_000
                     'typeoftax'.$wthary[12]=>$list3['F30'],	         //_DHC_000
					 'englishname'.$wthary[13]=>$list3['F09'],           //_DHC_000
					 'address'.$wthary[14]=>$list3['F06'],               //_DHC_000
					 'addressforship'.$wthary[15]=>$list3['F07'],	     //_DHC_000		 					 
					 'englishaddress'.$wthary[16]=>$list3['F08'],        //_DHC_000
					 'indicateforship'.$wthary[17]=>$list3['F32'],       //_DHC_000
					 'contact'.$wthary[18]=>$list3['F12'],	              //_DHC_000
					 'boss'.$wthary[19]=>$list3['F11'],		//_DHC_000
					 'tel'.$wthary[20]=>$list3['F13'],		            //_DHC_000
                     'fax'.$wthary[21]=>$list3['F14'],	                //_DHC_000  		
                     'email'.$wthary[22]=>$list3['F22'],	            //_DHC_000
					  'groupno'.$wthary[23]=>$list3['F44'],		           //_DHC_000         
                     'moneycrnt'.$wthary[24]=>$list3['F39'],	       //_DHC_000
					 'crntname'.$wthary[25]=>$list3['F0D'],	           //_IHL_000
                     'dayofincount'.$wthary[26]=>$list3['F17'],			//_DHC_000						 
                     'dayofcharge'.$wthary[27]=>$list3['F38'],	     	//_DHC_000				 
                     'wayofpay'.$wthary[28]=>$list3['F15'],		         //_DHC_000          
                     'paymentterm'.$wthary[29]=>$list3['F36'],	         // _DHL_000                       	                    
                     'salesno'.$wthary[30]=>$list3['F33'],                //_DHC_000
					 'salesname'.$wthary[31]=>$list3['F03A'],             //_IHL_000
                     'assistantno'.$wthary[32]=>$list3['F23'],	            //_DHL_000
					 'assistantname'.$wthary[33]=>$list3['F03B'],	    //_IHC_000
                     'wayofship'.$wthary[34]=>$list3['F31'],             //_DHL_000
                      'receiver'.$wthary[35]=>$list3['F40'],			//_DHL_000		 
                     'remark'.$wthary[36]=>$list3['F25'],                  //_DHC_000   				 
                     'lasttrade'.$wthary[37]=>$list3['F16'],				//_IHC_000					 
                     'lastquot'.$wthary[38]=>$list3['F19'],	              //_IHC_000
					 'lastupdate'.$wthary[39]=>$list3['F26']                 //_DHC_000      				 
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

 