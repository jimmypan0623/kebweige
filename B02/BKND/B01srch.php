<?php

    header("Content-Type: application/json; charset=utf-8"); // 修正為 json 格式
    header("Cache-Control: no-cache, must-revalidate");
    header("Pragma: no-cache");
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
	require_once "../../include/BKND/fieldpreset.php";
    $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key		
	$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 
	$customno=trim(substr(strrchr($_POST['filename'],'_'),1));   //客戶編號		 
	$searchRecord =trim($filterKey);			
	$sql3="SELECT d04.F02,b01.F02 AS F0B,d04.F01,d04.F06,d04.F03-d04.F09-d04.F21-d04.F23 AS F0G,";
	$sql3.="d04.F04,d04.F05,d03.F14,b01.F07,a14.F02 AS FZ2 FROM d04 ";
	$sql3.="LEFT OUTER JOIN b01 ON b01.F01=d04.F02 ";
	$sql3.="LEFT OUTER JOIN d03 ON d03.F01=d04.F01 ";
	$sql3.="LEFT OUTER JOIN a14 ON a14.F01=b01.F07 ";	  
	if(strlen($searchRecord)==0) {	  
        $sql3=$sql3."WHERE d03.F03='".trim($customno)."' AND d03.F04='Y' AND d04.F03-d04.F09-d04.F21-d04.F23>0 ";		
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' AND d03.F03='".$customno."' AND d03.F04='Y' AND d04.F03-d04.F09-d04.F21-d04.F23>0 "; 
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;
    $arr=array();	
    $result=@mysqli_query($link,$sql3); 

	$wthary = fldwdthpre('B02', 'M', $link);
    $afld=['F02','F0B','F01','F06','F0G','F04','F05','F14','F07','FZ2'];
    $arr=afldcont($result,$afld,$wthary);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
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

 