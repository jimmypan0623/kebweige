<?php
    require_once("../../include/BKND/auth_check.php"); //驗證
    header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔 
    require_once "../../include/BKND/fieldpreset.php";	
    $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key		
	$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 
	$customno=trim(substr(strrchr($_POST['filename'],'_'),1));   //客戶編號		 
	$searchRecord =trim($filterKey);			
	$sql3="SELECT c04.F02,b01.F02 AS F0B,c04.F01,c04.F06,c04.F03-c04.F09-c04.F21-c04.F23 AS F0G,";
	$sql3.="c04.F04,c04.F05,c03.F14,b01.F07,a14.F02 AS FZ2 FROM c04 ";
	$sql3.="LEFT OUTER JOIN b01 ON b01.F01=c04.F02 ";
	$sql3.="LEFT OUTER JOIN c03 ON c03.F01=c04.F01 ";
	$sql3.="LEFT OUTER JOIN a14 ON a14.F01=b01.F07 ";	  
	if(strlen($searchRecord)==0) {	  
        $sql3=$sql3."WHERE c03.F03='".trim($customno)."' AND c03.F04='Y' AND c04.F03-c04.F09-c04.F21-c04.F23>0 ";		
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' AND c03.F03='".$customno."' AND c03.F04='Y' AND c04.F03-c04.F09-c04.F21-c04.F23>0 "; 
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;
   
    $result=@mysqli_query($link,$sql3); 

	$wthary = fldwdthpre('B04', 'M', $link);
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

 