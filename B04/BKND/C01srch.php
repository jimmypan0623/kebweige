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
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT c01.F01,c01.F04,c01.F05,c01.F07,c01.F10,c01.F39,c01.F32,c01.F33,c01.F29,c01.F30,a01.F03 as F0C,c01.F12,c01.F13,c01.F31,c01.F15,c01.F36,c00.F02 as F0B FROM c01 ";	 
	 $sql3=$sql3."LEFT OUTER join a01 ON c01.F33=a01.F01 ";
	 $sql3=$sql3."LEFT OUTER join c00 ON c01.F39=c00.F01 ";
	 if(strlen($searchRecord)==0) {	          
		  $sql3=$sql3."WHERE c01.F01 IN (SELECT F03 FROM c03 WHERE F04='Y' AND F01 IN(SELECT F01 FROM c04 WHERE F03-F09-F21-F23>0 )) ";
	 }else{
	    $sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' and c01.F01 IN (SELECT F03 FROM c03 WHERE F04='Y' AND F01 in(SELECT F01 FROM c04 WHERE F03-F09-F21-F23>0 ))"; 
	 }
	 $sql3=$sql3."ORDER BY ".$fieldNo;
   $arr=array();	
    $result=@mysqli_query($link,$sql3); 
	
	
	$wthary = fldwdthpre('B04', 'C', $link);
    $afld=['F01','F05','F33','F0C','F39','F12','F31','F15','F36','F07','F32','F0B','F29','F30','F04','F10','F13'];
    $arr=afldcont($result,$afld,$wthary);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
        
?>  

 