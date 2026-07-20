<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入  
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT k08.F00,k08.F01,k08.F02,k08.F03,k08.F04,k08.F05,k08.F06,k08.F07,k08.F08,k08.F09,k08.F10,k08.F22,k08.F13, 
	        d01.F04 as F0E,a01.F03 as F0C FROM k08 
	        left outer join d01 on d01.F01=k08.F06
            left outer join a01 on a01.F01=k08.F09 			
			WHERE k08.F90='".$pgeno."' AND k08.F22='2' ORDER BY k08.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
	 	$sql3="SELECT k08.F00,k08.F01,k08.F02,k08.F03,k08.F04,k08.F05,k08.F06,k08.F07,k08.F08,k08.F09,k08.F10,k08.F22,k08.F13, 
	         d01.F04 as F0E,a01.F03 as F0C FROM k08 
	        left outer join d01 on d01.F01=k08.F06 
            left outer join a01 on a01.F01=k08.F09 	
		    WHERE k08.F90='".$pgeno."' AND k08.F22='3' and ".$fieldNo." like '%".trim($filterKey)."%' order by '".$fieldNo."', k08.F02"; 
    }	   
    $sql0="select * from a23 where F01='".$pgeno."'"; 
    $sql1=@mysqli_query($link,$sql0);                           
    $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表     
    $wthary=fldwdthpre('K11','1',$link);     
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F01','F06','F0E','F02','F09','F0C','F03','F04','F05','F07','F08','F10','F13'];
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

 