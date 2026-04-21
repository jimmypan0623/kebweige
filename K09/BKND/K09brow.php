<?php
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔  
    require_once "../../include/BKND/fieldpreset.php"; // 引入  
   $rows=0;
    $lastdate=date('Y'.'-'.'m'.'-'.'d');
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
	    $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;
	
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	    
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `k25` WHERE F12-F27>0 AND (F01>'00' AND F01<'23') ";   //
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
		$sql3="SELECT k25.*,d01.F04 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		$sql3.="LEFT JOIN d01 ON d01.F01=k25.F03 ";		
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 "; 
		$sql3.="WHERE k25.F12-k25.F27>0 AND (k25.F01>'00' AND k25.F01<'23') " ; 		
		$sql3.="ORDER BY k25.F90,k25.F02,k25.F07 ";	
		$start_rowrecord=$pagerows*($pgeno-1);	
	    $sql3.=" LIMIT ".$start_rowrecord.",".$pagerows;      
   }else{
	    /* $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1); */
		$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	    $fieldNo=$str[0];   
		$filterKey=$str[1]; 
		$sql3="SELECT k25.*,d01.F04 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		$sql3.="LEFT JOIN d01 ON d01.F01=k25.F03 ";
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 ";
		$sql3.="WHERE k25.F12-k25.F27>0 AND (k25.F01>'00' AND k25.F01<'23') " ; 		
		$sql3.="AND ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo;           
   }	      
     $wthary=fldwdthpre('K09','1',$link);  
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$firstday=new DateTime($lastdate);
	    $secondday=new DateTime($list3['F25']);		
	    $intvl = $secondday->diff($firstday);
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  
                     'shipday'.$wthary[1]=>$list3['F90'].'-'.$list3['F02'], 
					  'billno'.$wthary[2]=>$list3['F15'],
					 'invoiceno'.$wthary[3]=>$list3['F07'],	
					 'amount'.$wthary[4]=>$list3['F12'],
					 'restmoney'.$wthary[5]=>$list3['F12']-$list3['F27'],
					 'objtno'.$wthary[6]=>$list3['F03'], 		
                     'objtname'.$wthary[7]=>$list3['F0E'],					 
					 'unitedno'.$wthary[8]=>$list3['F04'],					
					 'inchargeno'.$wthary[9]=>$list3['F19'],	
					  'inchargename'.$wthary[10]=>$list3['F0C'],	
					  'shouldpayday'.$wthary[11]=>$list3['F25'], 
					  'over_days'.$wthary[12]=>($firstday>$secondday)?($intvl->days):0, 
					  'paymentway'.$wthary[13]=>$list3['F26'],					 
					 'lastupdate'.$wthary[14]=>$list3['F24']                      				 
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

 