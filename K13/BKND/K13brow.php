<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
     require_once "../../include/BKND/fieldpreset.php"; // 引入      
   $rnddgt=intval($_COOKIE["INT_069"]);
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
		$sql3="SELECT k09.*,d01.F04 AS F0E,a01.F03 AS F0C FROM k09 		 
		LEFT OUTER JOIN d01 ON d01.F01=k09.F02
		LEFT OUTER JOIN a01 ON a01.F01=k09.F11 	
		 
		WHERE k09.F22='2' AND k09.F90='".$pgeno."' ORDER BY k09.F05,k09.F03 ";  
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
        $sql3="SELECT k09.*,d01.F04 AS F0E,a01.F03 AS F0C FROM k09 		 
		LEFT OUTER JOIN d01 ON d01.F01=k09.F02
		LEFT OUTER JOIN a01 ON a01.F01=k09.F11 	
		 
		WHERE k09.F22='2' AND k09.F90='".$pgeno."' AND ".$fieldNo." LIKE '%".trim($filterKey)."%' ORDER BY ".$fieldNo." ASC, k09.F05 DESC"  ;   
    }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表   
   
     $wthary=fldwdthpre('K13','1',$link); 
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],                      
					 'write_no'.$wthary[1]=>$list3['F05'], 
					 'write_dat'.$wthary[2]=>$list3['F01'],
					  'bill_no'.$wthary[3]=>$list3['F03'],  					 
					 'invoice_no'.$wthary[4]=>$list3['F04'],  	
					 'invoice_date'.$wthary[5]=>$list3['F06'], 
					 'custom_no'.$wthary[6]=>$list3['F02'],	
					 'custom_name'.$wthary[7]=>$list3['F0E'],	
					 'write_money'.$wthary[8]=>$list3['F07'],
					 'pay_way'.$wthary[9]=>$list3['F08'],
		             'check_no'.$wthary[10]=>$list3['F09'],
					  'cash_day'.$wthary[11]=>$list3['F10'],
                     'sales_no'.$wthary[12]=>$list3['F11'],				
					  'sales_name'.$wthary[13]=>$list3['F0C'],						   
					 'lastupdate'.$wthary[14]=>$list3['F19']                      				 
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

 