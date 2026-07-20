<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                             //引用檔   
	require_once "../../include/BKND/fieldpreset.php";
	$searchRecord =trim($_POST['filename']);		
	 $sql3="SELECT `F01`,`F03` FROM `a01` ";
	 if(strlen($searchRecord)==0) {
	  
         $sql3=$sql3."WHERE 1 ";		
	 }else{
		   $sql3=$sql3."WHERE `F01` like '%".$searchRecord."%' ";	 
	 }
	 $sql3=$sql3."ORDER BY `F01`";

    $result=@mysqli_query($link,$sql3); 

	$wthary = fldwdthpre('C01', 'S', $link);
$afld=['F01','F03'];
$arr=afldcont($result,$afld,$wthary);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
 
?>  

 