<?php
   require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                      //引用檔 
 require_once("../../include/BKND/fieldpreset.php"); // 引入
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列	 
		$sql3="select a04.*  from a04 where a04.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by a04.F01,a04.F02"; 
	$wthary=fldwdthpre('A01','3',$link);
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F02','F03','F04','F05','F06','F07','F08','F09','F15'];
    $arr=afldcont($result,$afld,$wthary);
	
	mysqli_close($link);
	
          $arr = array_values($arr);
         
		echo json_encode(array ('recdrow'=>$arr,'pgttl'=>12));

?>  

 