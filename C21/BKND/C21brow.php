<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                               //引用檔   
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       $rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
       $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數	   
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `c26` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT c26.F00,c26.F01,c26.F02,c26.F03,c26.F05,c26.F06,c26.F07,c26.F09,c26.F14,c26.F11,c26.F10,c26.F15,
	        c01.F04 as F0D,c01.F05 as F0E,a01.F03 as F0C,c26.F04 FROM c26 
	        left outer join c01 on c01.F01=c26.F03
            left outer join a01 on a01.F01=c26.F06 			
			ORDER BY c26.F01 DESC";
	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
   }else{
	   $rows=12;
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	    //$searchRecord =$_POST['filename'];
		$sql3="SELECT c26.F00,c26.F01,c26.F02,c26.F03,c26.F05,c26.F06,c26.F07,c26.F09,c26.F14,c26.F11,c26.F10,c26.F15,
	        c01.F04 as F0D,c01.F05 as F0E,a01.F03 as F0C,c26.F04 FROM c26 
	        left outer join c01 on c01.F01=c26.F03
            left outer join a01 on a01.F01=c26.F06
		    WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo." ASC,c26.F01 DESC" ; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'query_no'=>$list3['F01'], 					 
                     'custom_no'=>$list3['F03'],	
                     'custom_name'=>$list3['F0E'],				
					 'custom_fullname'=>$list3['F0D'],		
                     'query_date'=>$list3['F02'],
                     'sales_no'=>$list3['F06'],		
					 'sales_name'=>$list3['F0C'],	
					 'crncy_type'=>$list3['F14'],	
                     'sourceman'=>$list3['F07'],	
                     'shipway'=>$list3['F09'],     	
                     'payment'=>$list3['F10'],     						 
                     'remark'=>$list3['F11'],  
                     'trns'=>$list3['F15'],     					 
                     'shure'=>$list3['F04'],     					 
					 'lastupdate'=>$list3['F05']                      				 
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

 