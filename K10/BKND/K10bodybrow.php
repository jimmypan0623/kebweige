<?php
 header("Content-Type: application/json; charset=utf-8");
 require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
   require_once "../../include/BKND/fieldpreset.php"; // 引入         
		 
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select k0h.* from `k0h`"; 
	  //  $sql3.=" where k0h.F01='".$str[0]."' ";
		$sql3.=" where k0h.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by k0h.F03"; 
	  $wthary=fldwdthpre('K10','2',$link);  	                                                              
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F03','F02','F14','F04','F05','F12','F11'];
    $arr=afldcont($result,$afld,$wthary);
	
	mysqli_close($link);
	 
          $arr = array_values($arr);
        
		  echo json_encode(array ('recdrow'=>$arr,'pgttl'=>12));
 
?>  

 