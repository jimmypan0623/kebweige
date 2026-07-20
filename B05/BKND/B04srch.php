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
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	  
	 $sql3="SELECT b04.F01,b04.F20,b04.F14,b04.F16,b04.F22,b04.F23,c00.F02 as F0B FROM b04 ";	  
	  $sql3=$sql3."LEFT OUTER join c00 ON b04.F14=c00.F01 ";
	 if(strlen($str[1])==0) {	          
		  $sql3=$sql3."WHERE b04.F90 ='".$str[2]."' AND b04.F06='".$str[3]."'"; 
	 }else{
	    $sql3=$sql3."WHERE ".$str[0]." LIKE '%".trim($str[1])."%' AND b04.F90='".$str[2]."' AND b04.F06='".$str[3]."'"; 			
	 }
	 $sql3=$sql3."ORDER BY ".$str[0];
     	
    $result=@mysqli_query($link,$sql3); 	
	$wthary = fldwdthpre('B05', 'B', $link);
    $afld=['F01','F20','F14','F16','F22','F23'];
    $arr=afldcont($result,$afld,$wthary);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
 
?>  

 