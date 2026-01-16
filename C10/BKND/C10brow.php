<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
   require_once "../../include/BKND/fieldpreset.php"; // 引入        
   $rnddgt=intval($_COOKIE["INT_069"]);
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
		$sql3="SELECT c10.*,c01.F05 AS F0E,a0A.F03 AS F0C,a0B.F03 AS F0B,a14.F02 AS F0D FROM c10 		 
		LEFT OUTER JOIN c01 ON c01.F01=c10.F02
		LEFT OUTER JOIN `a01` AS a0A ON c10.F10 = a0A.F01 	
		LEFT OUTER JOIN `a01` AS a0B ON c10.F14 = a0B.F01
		LEFT OUTER JOIN `a14` ON a14.F01=c10.F15
		WHERE c10.F90='".$pgeno."' ORDER BY c10.F01,c10.F03 ";  
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
        $sql3="SELECT c10.*,c01.F05 AS F0E,a0A.F03 AS F0C,a0B.F03 AS F0B,a14.F02 AS F0D FROM c10 		 
		LEFT OUTER JOIN c01 ON c01.F01=c10.F02
		LEFT OUTER JOIN `a01` AS a0A ON c10.F10 = a0A.F01 
		LEFT OUTER JOIN `a01` AS a0B ON c10.F14 = a0B.F01 	
		LEFT OUTER JOIN `a14` ON a14.F01=c10.F15
		WHERE c10.F90='".$pgeno."' AND ".$fieldNo." LIKE '%".trim($filterKey)."%' ORDER BY ".$fieldNo." ASC, c10.F01 DESC"  ;   
    }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表   
   
   $wthary=fldwdthpre('C10','1',$link);
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],       
                     'stock_no'.$wthary[1]=>$list3['F03'], 	//_DSL_010
					 'bill_no'.$wthary[2]=>$list3['F04'], 	   //_DSL_009
					 'ship_date'.$wthary[3]=>$list3['F01'],    //_DSC_003
					 'recipt_no'.$wthary[4]=>$list3['F05'],     //_DSL_009
					 'custom_no'.$wthary[5]=>$list3['F02'],	  //_DSL_007
					 'custom_name'.$wthary[6]=>$list3['F0E'],	   //_ISL_007
					 'ship_qty'.$wthary[7]=>$list3['F08'],       //_DSR_007
		             'unit_price'.$wthary[8]=>$list3['F07'], 	  //_DSR_007		 
                     'crncy_type'.$wthary[9]=>$list3['F06'],	 //_DSC_004
                     'crncy_rate'.$wthary[10]=>$list3['F09'],	 	//_DSR_007				 
                     'rcd_total'.$wthary[11]=>round($list3['F08']*$list3['F07']*$list3['F09'],$rnddgt),  //_DSR_008
					  'depart_no'.$wthary[12]=>$list3['F15'],				//_DHL_000
					  'depart_name'.$wthary[13]=>$list3['F0D'],	    //_ISL_007
					  'sales_no'.$wthary[14]=>$list3['F10'],			//_DHL_000	
					  'sales_name'.$wthary[15]=>$list3['F0C'],	      //_ISL_007
					  'assist_no'.$wthary[16]=>$list3['F14'],	     //_DHL_000
					   'assist_name'.$wthary[17]=>$list3['F0B'],	   //_ISL_007
					 'custom_po'.$wthary[18]=>$list3['F16'],         //_DSL_010
					 'custom_partno'.$wthary[19]=>$list3['F17'],     //_DSL_010
					 'lastupdate'.$wthary[20]=>$list3['F19']             //_DHL_000         				 
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

 