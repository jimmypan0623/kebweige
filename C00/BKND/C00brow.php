<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                           //引用檔
   $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
        $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       $rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
	   $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數         
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	  
      
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `c00` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT c00.F00,c00.F01,c00.F04,c00.F02,c00.F03 FROM c00 ORDER BY c00.F01";
	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
   }else{
	    
		$fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	    //$searchRecord =$_POST['filename'];
		$sql3="SELECT c00.F00,c00.F01,c00.F04,c00.F02,c00.F03 FROM c00  	
		       WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
	$arr=array();	
    $sql4=mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],  		            	             
		             'crncy_no'=>$list3['F01'], 					 
                     'crncy_name'=>$list3['F04'],					                     
                     'rate'=>$list3['F02'],                                         
					 'lastupdate'=>$list3['F03']                      				 
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

 