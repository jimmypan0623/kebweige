<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入  
   $rnddgt=intval($_COOKIE["INT_069"]);
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
		$sql3="SELECT d01.F01,d01.F03,d01.F04 FROM d01 WHERE F01 IN (SELECT F03 FROM d19 WHERE F90='".$pgeno."')		 		
		 ORDER BY d01.F01 ";  
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
        $sql3="SELECT d01.F01,d01.F03,d01.F04 FROM d01 WHERE F01 IN (SELECT F03 FROM d19 WHERE F90='".$pgeno."') AND ".$fieldNo." LIKE '%".trim($filterKey)."%' ORDER BY ".$fieldNo  ;   
    }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表     
	$wthary=fldwdthpre('D19','1',$link); 
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array( 
                     
					 'vendor_no'.$wthary[0]=>$list3['F01'],	
					 'vendor_fuulname'.$wthary[1]=>$list3['F03'],	
					 'vendor_name'.$wthary[2]=>$list3['F04'] 	 
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

 