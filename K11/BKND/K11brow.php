<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入  
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT k08.F00,k08.F01,k08.F02,k08.F03,k08.F04,k08.F05,k08.F06,k08.F07,k08.F08,k08.F09,k08.F10,k08.F22,k08.F13, 
	        d01.F04 as F0E,a01.F03 as F0C FROM k08 
	        left outer join d01 on d01.F01=k08.F06
            left outer join a01 on a01.F01=k08.F09 			
			WHERE k08.F90='".$pgeno."' AND k08.F22='2' ORDER BY k08.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
	 	$sql3="SELECT k08.F00,k08.F01,k08.F02,k08.F03,k08.F04,k08.F05,k08.F06,k08.F07,k08.F08,k08.F09,k08.F10,k08.F22,k08.F13, 
	         d01.F04 as F0E,a01.F03 as F0C FROM k08 
	        left outer join d01 on d01.F01=k08.F06 
            left outer join a01 on a01.F01=k08.F09 	
		    WHERE k08.F90='".$pgeno."' AND k08.F22='3' and ".$fieldNo." like '%".trim($filterKey)."%' order by '".$fieldNo."', k08.F02"; 
    }	   
    $sql0="select * from a23 where F01='".$pgeno."'"; 
    $sql1=@mysqli_query($link,$sql0);                           
    $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表     
    $wthary=fldwdthpre('K11','1',$link);     
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  		            	             
		             'query_no'.$wthary[1]=>$list3['F01'], 					 
                     'custom_no'.$wthary[2]=>$list3['F06'],	
                     'custom_name'.$wthary[3]=>$list3['F0E'],	
                     'query_date'.$wthary[4]=>$list3['F02'],
                     'sales_no'.$wthary[5]=>$list3['F09'],		
					 'sales_name'.$wthary[6]=>$list3['F0C'],						 
					  'wayofpay'.$wthary[7]=>$list3['F03'],		
					  'checkno'.$wthary[8]=>$list3['F04'],	
					   'checkday'.$wthary[9]=>$list3['F05'],	
					  'howmuch'.$wthary[10]=>$list3['F07'],	                            				 
                      'remark'.$wthary[11]=>$list3['F08'], 	
					  'shure'.$wthary[12]=>$list3['F10'],     		
					 'lastupdate'.$wthary[13]=>$list3['F13']                      				 
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

 