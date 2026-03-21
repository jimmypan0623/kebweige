<?php
   header("Content-Type: application/json; charset=utf-8");
 header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
   include("../../include/BKND/mysqli_server.php");                              //引用檔  
    require_once "../../include/BKND/fieldpreset.php"; // 引入     
   $rnddgt=intval($_COOKIE["INT_069"]);
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
		$sql3="SELECT c01.F01,c01.F04,c01.F05 FROM c01 WHERE F01 IN (SELECT F03 FROM c13 WHERE F90='".$pgeno."')		 		
		 ORDER BY c01.F01 ";  
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
        $sql3="SELECT c01.F01,c01.F04,c01.F05 FROM c01 WHERE F01 IN (SELECT F03 FROM c13 WHERE F90='".$pgeno."') AND ".$fieldNo." LIKE '%".trim($filterKey)."%' ORDER BY ".$fieldNo  ;   
    }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表  
	 $wthary=fldwdthpre('C12','1',$link);
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array( 
                    
					 'custom_no'.$wthary[0]=>$list3['F01'],	
					 'custom_fuulname'.$wthary[1]=>$list3['F04'],	
					 'custom_name'.$wthary[2]=>$list3['F05'] 	 
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

function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    // 使用強型別比較，避免索引為 0 時判定為 false
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}

?>  

 