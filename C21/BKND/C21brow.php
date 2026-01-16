<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                               //引用檔   
   require_once "../../include/BKND/fieldpreset.php"; // 引入     
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
	   $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	//每頁筆數	
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
    $wthary=fldwdthpre('C21','1',$link);  	                      
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  		     //_DHL_000       	             
		             'query_no'.$wthary[1]=>$list3['F01'], 		//_DSL_010			 
                     'custom_no'.$wthary[2]=>$list3['F03'],	    //_DSL_007
                     'custom_name'.$wthary[3]=>$list3['F0E'],			//_ISL_007	
					 'custom_fullname'.$wthary[4]=>$list3['F0D'],		//_IHL_000
                     'query_date'.$wthary[5]=>$list3['F02'],       //_DSC_009
                     'sales_no'.$wthary[6]=>$list3['F06'],		    //_DHC_000
					 'sales_name'.$wthary[7]=>$list3['F0C'],	   //_ISL_007
					 'crncy_type'.$wthary[8]=>$list3['F14'],	    //_DSC_004
                     'sourceman'.$wthary[9]=>$list3['F07'],	    //_DSL_013
                     'shipway'.$wthary[10]=>$list3['F09'],     	    //_DSL_013
                     'payment'.$wthary[11]=>$list3['F10'],     			//_DSL_013			 
                     'remark'.$wthary[12]=>$list3['F11'],        //_DSL_013
                     'trns'.$wthary[13]=>$list3['F15'],     			//_IHC_000		 
                     'shure'.$wthary[14]=>$list3['F04'],     			//_IHC_000		 
					 'lastupdate'.$wthary[15]=>$list3['F05']              //_DHL_000        				 
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

 