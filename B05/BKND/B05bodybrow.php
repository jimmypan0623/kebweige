<?php
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
     require_once "../../include/BKND/fieldpreset.php"; // 引入      
         
		 
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		$sql3="select b0e.*,b01.F02 as F0B,a14.F02 as F0C from `b0e`"; 
		$sql3.=" left outer join b01 on b0e.F03=b01.F01";
		$sql3.=" left outer join a14 on b0e.F05=a14.F01 "; 		
		$sql3.=" where b0e.F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by b0e.F03"; 
	$wthary=fldwdthpre('B05','2',$link); 	                                                              
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F03','F0B','F07','F04','F15','F05','F0C','F08','F09','F12','F13'];
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

 