<?php
   header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔 
	require_once "../../include/BKND/fieldpreset.php"; // 引入  
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT b06.*,
	        a1A.F02 as F0B,a1B.F02 AS F0C FROM b06 
	        LEFT OUTER JOIN `a14` AS a1A  ON b06.F05=a1A.F01  
	        LEFT OUTER JOIN `a14` AS a1B  ON b06.F07=a1B.F01  	
			WHERE b06.F90='".$pgeno."' ORDER BY b06.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
		$sql3="SELECT b06.*,
	        a1A.F02 as F0B,a1B.F02 AS F0C FROM b06  
	        LEFT OUTER JOIN `a14` AS a1A  ON b06.F05=a1A.F01  
	        LEFT OUTER JOIN `a14` AS a1B  ON b06.F07=a1B.F01  
		    WHERE b06.F90='".$pgeno."' and ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo.",b06.F02 DESC " ; 
   }	   
   $sql0="select * from a23 where F01='".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表 
    $wthary=fldwdthpre('B06','1',$link); 	 	 
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F01','F02','F05','F0B','F07','F0C','F08','F10','F11'];
    $arr=afldcont($result,$afld,$wthary);
	
	mysqli_close($link);
	
	     
          $arr = array_values($arr);
       
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$list4['F07']));		 //($list4['F07']=='Y'?1:0))

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

 