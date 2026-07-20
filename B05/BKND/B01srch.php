<?php
require_once("../../include/BKND/auth_check.php"); //驗證
    // 1. 設定回傳格式為 JSON 且避免亂碼
header("Content-Type: application/json; charset=utf-8");

// 2. 現代瀏覽器的防快取設定
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

// 3. 舊版 HTTP/1.0 瀏覽器與某些 Proxy 的防快取設定
header("Pragma: no-cache"); 
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // 讓過期時間設定在過去
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔 
	require_once "../../include/BKND/fieldpreset.php";
    $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key		
	$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 
	$shipno=trim(substr(strrchr($_POST['filename'],'_'),1));   //出貨單號		 
	$searchRecord =trim($filterKey);			
	$sql3="SELECT b0d.F03,b01.F02 AS F0B,b0d.F07,LEAST((c04.F09-c04.F24),b0d.F04) AS F0D,";   
	$sql3.="b0d.F15,b0d.F08,b0d.F09,b01.F07 AS F0G,a14.F02 AS FZ2 FROM b0d ";
	$sql3.="LEFT OUTER JOIN b01 ON b01.F01=b0d.F03 "; 
	$sql3.="LEFT OUTER JOIN a14 ON a14.F01=b01.F07 ";	  
	$sql3.="LEFT OUTER JOIN c04 ON c04.F01=b0d.F07 AND c04.F02=b0d.F03 ";	
	if(strlen($searchRecord)==0) {	  
        $sql3=$sql3."WHERE b0d.F01='".trim($shipno)."' AND c04.F09-c04.F24>0 ";		
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' AND b0d.F01='".trim($shipno)."' AND c04.F09-c04.F24>0 "; 
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;	
    $result=@mysqli_query($link,$sql3); 	
	$wthary = fldwdthpre('B05', 'M', $link);
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

 