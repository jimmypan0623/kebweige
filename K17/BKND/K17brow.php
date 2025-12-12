<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔
   $rnddgt=$_COOKIE["INT_069"];
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $dptno=substr(strrchr($_POST['filename'],'|'),1); // 月次
	    
        if(substr($dptno,0,1)=='3'){
		   $sql3="SELECT k25.*,c01.F05 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		   $sql3.="LEFT JOIN c01 ON c01.F01=k25.F03 ";
		}else{			
		   $sql3="SELECT k25.*,d01.F04 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		   $sql3.="LEFT JOIN d01 ON d01.F01=k25.F03 ";
		}
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 "; 
		 
		$sql3.="WHERE k25.F90='".$pgeno."' AND k25.F01='".$dptno."' ";
		$sql3.="ORDER BY k25.F02,k25.F07 ";	
		     
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  		
	    $pgeno=getNeedBetween($_POST['filename'],'_','~'); // 月次 
		$dptno=substr(strrchr($_POST['filename'],'~'),1);  //發票類別
       if(substr($dptno,0,1)=='3'){
		   $sql3="SELECT k25.*,c01.F05 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		    $sql3.="LEFT JOIN c01 ON c01.F01=k25.F03 ";
		}else{
		   $sql3="SELECT k25.*,d01.F04 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		   $sql3.="LEFT JOIN d01 ON d01.F01=k25.F03 ";
		}	   
		
		 
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 ";
		$sql3.="WHERE k25.F90='".$pgeno."' AND k25.F01='".$dptno."' ";
		$sql3.="AND ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo;   
             
   }	   
     $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表   
 //	 'objtname_DSL_007'=>$list3['F0E'],
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){	 
		$atr = array('rc_no_DHL_000'=>$list3['F00'],  
                     'shipday_DSC_003'=>$list3['F02'], 
					 'invoiceno_DSL_010'=>$list3['F07'],	
					 'objtno_DSL_007'=>$list3['F03'], 		
                     'objtname_DSL_007'=>$list3['F0E'],					 
					 'unitedno_DSL_007'=>$list3['F04'],
					 'tax_type_DHL_000'=>$list3['F09'], 
					 'crncytype_DSC_004'=>$list3['F21'],  
					 'crncyrate_DSR_008'=>$list3['F22'],						
					 'beforetax_DSR_009'=>$list3['F08'],		           			 
                     'taxamt_DSR_009'=>$list3['F10'],	 
                     'amount_DSR_009'=>$list3['F12'],	 					 
                     'billno_DSL_010'=>$list3['F15'],					 					
                     'departno_DHL_000'=>$list3['F14'],	
					 'departname_DSL_007'=>$list3['F0B'],	
					 'inchargeno_DHL_000'=>$list3['F19'],	
					  'inchargename_DSL_007'=>$list3['F0C'],	
					 'lastupdate_DHL_000'=>$list3['F24']                      				 
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

 