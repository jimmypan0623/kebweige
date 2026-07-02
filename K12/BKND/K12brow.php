<?php
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
     require_once "../../include/BKND/fieldpreset.php"; // 引入      
   $rnddgt=intval($_COOKIE["INT_069"]);
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
		$sql3="SELECT k09.*,c01.F05 AS F0E,a01.F03 AS F0C FROM k09 		 
		LEFT OUTER JOIN c01 ON c01.F01=k09.F02
		LEFT OUTER JOIN a01 ON a01.F01=k09.F11 	
		 
		WHERE k09.F22='3' AND k09.F90='".$pgeno."' ORDER BY k09.F05,k09.F03 ";  
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
        $sql3="SELECT k09.*,c01.F05 AS F0E,a01.F03 AS F0C FROM k09 		 
		LEFT OUTER JOIN c01 ON c01.F01=k09.F02
		LEFT OUTER JOIN a01 ON a01.F01=k09.F11 	
		 
		WHERE k09.F22='3' AND k09.F90='".$pgeno."' AND ".$fieldNo." LIKE '%".trim($filterKey)."%' ORDER BY ".$fieldNo." ASC, k09.F05 DESC"  ;   
    }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表   
   
     $wthary=fldwdthpre('K12','1',$link); 
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F05','F01','F03','F04','F06','F02','F0E','F07','F08','F09','F10','F11','F0C','F19'];
    $arr=afldcont($result,$afld,$wthary);
	
	mysqli_close($link);
	   
          $arr = array_values($arr);
      
         echo json_encode(array ('recdrow'=>$arr,'transcode'=>$list4['F07']));		 
         
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

 