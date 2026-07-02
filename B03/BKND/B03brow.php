<?php
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
   require_once "../../include/BKND/fieldpreset.php"; // 引入 
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT b03.F00,b03.F01,b03.F02,b03.F06,b03.F08,b03.F10,b03.F09,b03.F24,b03.F14,b03.F16,b03.F20,b03.F21,b03.F22,b03.F23,b03.F25,b03.F13,
	        d01.F04 as F0E,d01.F03 AS F0D,d01.F06 AS F1Z,d01.F08 AS F0H ,d01.F09 AS F1C,a01.F03 as F0C FROM b03 
	        left outer join d01 on d01.F01=b03.F06
            left outer join a01 on a01.F01=b03.F09 			
			WHERE b03.F90='".$pgeno."' ORDER BY b03.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
	 	$sql3="SELECT b03.F00,b03.F01,b03.F02,b03.F06,b03.F08,b03.F10,b03.F09,b03.F24,b03.F14,b03.F16,b03.F20,b03.F21,b03.F22,b03.F23,b03.F25,b03.F13,
	         d01.F04 as F0E,d01.F03 AS F0D,d01.F06 AS F1Z,d01.F08 AS F0H ,d01.F09 AS F1C,a01.F03 as F0C FROM b03 
	        left outer join d01 on d01.F01=b03.F06 
            left outer join a01 on a01.F01=b03.F09 	
		    WHERE b03.F90='".$pgeno."' and ".$fieldNo." like '%".trim($filterKey)."%' order by '".$fieldNo."', b03.F02"; 
    }	   
    $sql0="select * from a23 where F01='".$pgeno."'"; 
    $sql1=@mysqli_query($link,$sql0);                           
    $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表         
	$wthary=fldwdthpre('B03','1',$link); 	         
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F01','F06','F0E','F0D','F1Z','F0H','F1C','F02','F09','F0C','F08','F21','F20','F22','F23','F14',
       'F16','F24','F25','F10','F13'];
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

 