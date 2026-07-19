<?php
    header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
	require_once "../../include/BKND/fieldpreset.php";
    $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key		
	$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 
	$shipno=trim(substr(strrchr($_POST['filename'],'_'),1));   //出貨單號		 
	$searchRecord =trim($filterKey);			
	$sql3="SELECT b0b.F03,b01.F02 AS F0B,b0b.F07,LEAST((d04.F09-d04.F24),b0b.F04) AS F0D,";   
	$sql3.="b0b.F15,b0b.F08,b0b.F09,b01.F07 AS F0G,a14.F02 AS FZ2 FROM b0b ";
	$sql3.="LEFT OUTER JOIN b01 ON b01.F01=b0b.F03 "; 
	$sql3.="LEFT OUTER JOIN a14 ON a14.F01=b01.F07 ";	  
	$sql3.="LEFT OUTER JOIN d04 ON d04.F01=b0b.F07 AND d04.F02=b0b.F03 ";	
	if(strlen($searchRecord)==0) {	  
        $sql3=$sql3."WHERE b0b.F01='".trim($shipno)."' AND d04.F09-d04.F24>0 ";		
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' AND b0b.F01='".trim($shipno)."' AND d04.F09-d04.F24>0 "; 
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;
    
    $result=@mysqli_query($link,$sql3); 
	
	$wthary = fldwdthpre('B03', 'M', $link);
    $afld=['F03','F0B','F07','F0D','F15','F08','F09','F0G','FZ2'];
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

 