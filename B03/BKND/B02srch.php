<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔         
	  require_once "../../include/BKND/fieldpreset.php"; 
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	  
	 $sql3="SELECT b02.F01,b02.F20,b02.F14,b02.F16,b02.F22,b02.F23 FROM b02 ";	  
	  
	 if(strlen($str[1])==0) {	          
		  $sql3=$sql3."WHERE b02.F90 ='".$str[2]."' AND b02.F06='".$str[3]."'"; 
	 }else{
	    $sql3=$sql3."WHERE ".$str[0]." LIKE '%".trim($str[1])."%' AND b02.F90='".$str[2]."' AND b02.F06='".$str[3]."'"; 			
	 }
	 $sql3=$sql3."ORDER BY ".$str[0];
     	
    $result=@mysqli_query($link,$sql3); 
	
	$wthary = fldwdthpre('B03', 'B', $link);
    $afld=['F01','F20','F14','F16','F22','F23'];
    $arr=afldcont($result,$afld,$wthary);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
 
?>  

 