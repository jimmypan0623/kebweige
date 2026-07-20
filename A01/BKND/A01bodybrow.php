<?php
  require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
  require_once("../../include/BKND/mysqli_server.php");                               //引用檔       
 require_once "../../include/BKND/fieldpreset.php"; // 引入
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列	   
	    $sql3="SELECT a02.*,a01.F03 F03C,a03.F02,a03.F08 F0H,a03.F09 F0I,a03.F10 F1J,a03.F11 F1K,a03.F12 F1L FROM a02";
		$sql3.=" LEFT OUTER JOIN a03 ON a03.F01=a02.F03 ";
		$sql3.=" LEFT OUTER JOIN a01 ON a01.F01=a02.F01 ";
		$sql3.="WHERE  a02.F03='".$str[0]."' AND ".$str[1]." LIKE '%".trim($str[2])."%' ORDER BY a02.F01 ";          
	$wthary=fldwdthpre('A01','2',$link);
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 	
	$afld=['F00','F01','F03C','F04','F05','F06','F07','F08','F09','F10','F11','F12','F0H','F0I','F1J','F1K','F1L','F13'];
    $arr=afldcont($result,$afld,$wthary);
	
	mysqli_close($link);
	       
          $arr = array_values($arr);
         
		  echo json_encode(array ('recdrow'=>$arr,'pgttl'=>12));

?>  

 