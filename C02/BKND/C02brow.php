<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                          //引用檔   
   $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       $rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
	   $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數         
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `c02` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT c02.F00,c02.F01,c02.F02,c02.F03,c02.F04,c02.F06,c02.F07,c02.F08,c02.F10,c02.F11,c02.F13,c02.F15,c02.F16,c02.F99,c01.F05 as F0E FROM c02"; 	   
	   $sql.=" left outer join c01 on c01.F01=c02.F01"; 	
	   $sql.=" ORDER BY c02.F03,c02.F01,c02.F02 desc";	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
	    
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	    //$searchRecord =$_POST['filename'];
		$sql="SELECT c02.F00,c02.F01,c02.F02,c02.F03,c02.F04,c02.F06,c02.F07,c02.F08,c02.F10,c02.F11,c02.F13,c02.F15,c02.F16,c02.F99,c01.F05 as F0E FROM c02"; 	   
	    $sql.=" left outer join c01 on c01.F01=c02.F01"; 	  
		$sql3=$sql." WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'stock_no'=>$list3['F03'],                                     				                     				                                       
					 'custom_no'=>$list3['F01'],
					 'custom_name'=>$list3['F0E'], 
					 'custom_partno'=>$list3['F04'], 
					 'current'=>$list3['F06'], 
					 'price'=>$list3['F07'],
					 'minorder'=>$list3['F08'],
					 'basicpack'=>$list3['F13'],
					 'payment'=>$list3['F10'],
					  'quotation'=>$list3['F11'],
					 'origin_date'=>$list3['F02'], 
                     'invalid_date'=>$list3['F15'],		
					  'remark'=>$list3['F16'],
					 'lastupdate'=>$list3['F99']                      				 
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

 