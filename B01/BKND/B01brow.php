<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                      //引用檔  
   $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       $rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
       $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數    
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `b01` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT b01.F00,b01.F01,b01.F02,b01.F03,b01.F04,b01.F06,b01.F98,b01.F03,b01.F04,b01.F05,
	   b01.F07,a14.F02 as F0B,b01.F07,b11B.nTqty,b11A.F04 as F0D,b01.F10,b01.F11,b01.F41,b01.F97,b01.F28,b01.F31,b01.F39,b01.F30,b01.F38,b01.F37,b01.F21,b01.F29,b01.F42,b01.F49 FROM `b01` 
	   LEFT OUTER JOIN `a14` ON  a14.F01=b01.F07 
       LEFT OUTER JOIN (SELECT F03,SUM(F04) AS nTqty FROM b11 GROUP BY F03 ORDER BY F03 ) as b11B ON b11B.F03=b01.F01	   
       LEFT OUTER JOIN `b11` AS b11A  ON b01.F01=b11A.F03 AND b01.F07=b11A.F01 	   
	   order by b01.F01 ";	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	    //$searchRecord =$_POST['filename'];
		$sql3="SELECT b01.F00,b01.F01,b01.F02,b01.F03,b01.F04,b01.F06,b01.F98,b01.F03,b01.F04,b01.F04,b01.F05,
		b01.F07,a14.F02 as F0B,b01.F07,b11B.nTqty,b11A.F04 as F0D,b01.F10,b01.F11,b01.F41,b01.F97,b01.F28,b01.F31,b01.F39,b01.F30,b01.F38,b01.F37,b01.F21,b01.F29,b01.F42,b01.F49 FROM `b01` 
		LEFT JOIN `a14` ON a14.F01=b01.F07 
		LEFT OUTER JOIN `b11` AS b11A  ON b01.F01=b11A.F03 AND b01.F07=b11A.F01	   
		LEFT OUTER JOIN (SELECT F03,SUM(F04) AS nTqty FROM b11 GROUP BY F03 ORDER BY F03 ) as b11B ON b11B.F03=b01.F01	
		WHERE BINARY ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo.",b01.F01" ; 
   }	   
    $rndnb=$_COOKIE['INT_001'];  //參數設定的小數位數
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'stock_no'=>$list3['F01'], 					 
                     'stock_name'=>$list3['F02'],					                     
                     'tpemng'=>$list3['F06'],  
                     'tpblng'=>$list3['F98'],
                     'eachprchs'=>$list3['F03'],
                     'eachcount'=>$list3['F04'],  	
                     'dividing'=>$list3['F05'],
					 'dptno'=>$list3['F07'],					
					 'dptname'=>$list3['F0B'],	
                     'ntqty'=>round($list3['nTqty'],$rndnb),							 
					 'dpqty'=>round($list3['F0D'],$rndnb),                    
					 'maxinv'=>$list3['F10'],
					 'minuminv'=>$list3['F11'],
					 'location'=>$list3['F41'],
					 'buildbom'=>$list3['F97'],
					 'tpeofaply'=>$list3['F39'],
					 'lotnomng'=>$list3['F30'],
					 'prchsleadtime'=>$list3['F28'],
					 'warehousereadytime'=>$list3['F31'],					 					 
					 'salescost'=>$list3['F38'],
					 'averagecost'=>$list3['F37'],
					 'remark'=>$list3['F29'],	
					 'mtrtype'=>$list3['F42'],	
					 'orignplace'=>$list3['F49'],	
					 'lastupdate'=>$list3['F21']                      				 
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

 