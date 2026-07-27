<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   
 require_once("../../include/BKND/mysqli_server.php");                              //引用檔      
 require_once "../../include/BKND/fieldpreset.php";
    $str1=$_POST['filename'];
	if(substr($str1, 0, 2)=='BC' || substr($str1, 0, 2)=='BD'){
		$srcdb='c13';
	}else{
		$srcdb='d19';
	}
	$sql3="SELECT *,F06*F07*F14 AS F0G FROM ".$srcdb." WHERE F02='".$str1."' ORDER BY F05";			  
    $result=@mysqli_query($link,$sql3); 
 	
	// 獲取欄位寬度設定
$wthary = fldwdthpre('K17', 'A', $link); 
$afld=['F05','F02','F06','F07','F13','F14','F0G'];
$arr=afldcont($result,$afld,$wthary);  
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 

?>  

 