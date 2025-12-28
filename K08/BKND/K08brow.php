<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔  
   $rows=0;
    $lastdate=date('Y'.'-'.'m'.'-'.'d');
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
	    $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;
	
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	    
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `k25` WHERE F12-F27>0 AND (F01>'24' AND F01<'33') ";   //
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
		$sql3="SELECT k25.*,c01.F05 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		$sql3.="LEFT JOIN c01 ON c01.F01=k25.F03 ";		
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 "; 
		$sql3.="WHERE k25.F12-k25.F27>0 AND (k25.F01>'24' AND k25.F01<'33') " ; 		
		$sql3.="ORDER BY k25.F90,k25.F02,k25.F07 ";	
		$start_rowrecord=$pagerows*($pgeno-1);	
	    $sql3.=" LIMIT ".$start_rowrecord.",".$pagerows;      
   }else{	  
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	    $fieldNo=$str[0];  //substr($_POST['filename'],0,7);	   
		$filterKey=$str[1];//substr(strrchr($_POST['filename'],'|'),1);
		$sql3="SELECT k25.*,c01.F05 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		$sql3.="LEFT JOIN c01 ON c01.F01=k25.F03 ";
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 ";
		$sql3.="WHERE k25.F12-k25.F27>0 AND (k25.F01>'24' AND k25.F01<'33') " ; 		
		$sql3.="AND ".$fieldNo." like '%".trim($filterKey)."%' ORDER BY k25.F90,k25.F02,k25.F07";//.$fieldNo;
   }	      
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$firstday=new DateTime($lastdate);
	    $secondday=new DateTime($list3['F25']);		
	    $intvl = $secondday->diff($firstday);
		$atr = array('rc_no_DHL_000'=>$list3['F00'],  
                     'shipday_DSC_009'=>$list3['F90'].'-'.$list3['F02'], 
					  'billno_DSL_010'=>$list3['F15'],
					 'invoiceno_DSL_010'=>$list3['F07'],	
					 'amount_DSR_009'=>$list3['F12'],
					 'restmoney_DSR_009'=>$list3['F12']-$list3['F27'],
					 'objtno_DSL_007'=>$list3['F03'], 		
                     'objtname_DSL_007'=>$list3['F0E'],					 
					 'unitedno_DSL_007'=>$list3['F04'],					
					 'inchargeno_DHL_000'=>$list3['F19'],	
					  'inchargename_DSL_007'=>$list3['F0C'],	
					  'shouldpayday_DSC_009'=>$list3['F25'], 
					  'over_days_DSR_007'=>($firstday>$secondday)?($intvl->days):0, 
					  'paymentway_DSL_008'=>$list3['F26'],					 
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

 