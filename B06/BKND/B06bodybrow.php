<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   

  require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
  require_once "../../include/BKND/fieldpreset.php"; // 引入         
		 
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="SELECT b0f.*,b01.F02 AS F0B FROM b0f"; 
		$sql3.=" LEFT OUTER JOIN b01 on b0f.F03=b01.F01";
		$sql3.=" where b0f.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by b0f.F03"; 
	 $wthary=fldwdthpre('B06','2',$link); 	 	 	                                                              
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F03','F0B','F04','F25','F11'];
    $arr=afldcont($result,$afld,$wthary);
	
	mysqli_close($link);
	
          $arr = array_values($arr);
        		
		  echo json_encode(array ('recdrow'=>$arr,'pgttl'=>12));
      
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

 