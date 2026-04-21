<?php
   header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔 
	require_once "../../include/BKND/fieldpreset.php"; // 引入  
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT b09.*,
	        a14.F02 as F0B FROM b09 
	        LEFT OUTER JOIN `a14` ON b09.F05=a14.F01  	       
			WHERE b09.F90='".$pgeno."' ORDER BY b09.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
		$sql3="SELECT b09.*,
	        a14.F02 as F0B FROM b09  
	        LEFT OUTER JOIN `a14` ON b09.F05=a14.F01  	        
		    WHERE b09.F90='".$pgeno."' and ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo.",b09.F02 DESC " ; 
   }	   
   $sql0="select * from a23 where F01='".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表 
    $wthary=fldwdthpre('B09','1',$link); 	 	 
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  		            	             
		             'query_no'.$wthary[1]=>$list3['F01'], 					                      
                     'query_date'.$wthary[2]=>$list3['F02'],                    
					 'sendout_dptno'.$wthary[3]=>$list3['F05'],	
					 'sendout_dptname'.$wthary[4]=>$list3['F0B'],	                     				                   
					 'remark_direct'.$wthary[5]=>$list3['F08'],  	
                     'shure'.$wthary[6]=>$list3['F10'],     					 
					 'lastupdate'.$wthary[7]=>$list3['F11']                      				 
					 );                      			
		array_push($arr,$atr);
	}
	mysqli_close($link);
	
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$list4['F07']));		 //($list4['F07']=='Y'?1:0))
		 
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

 