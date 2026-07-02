<?php
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入         
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $sql3="SELECT b05.F00,b05.F01,b05.F02,b05.F06,b05.F08,b05.F10,b05.F09,b05.F24,b05.F14,b05.F16,b05.F20,b05.F21,b05.F22,b05.F23,b05.F25,b05.F13,
	        c01.F05 as F0E,c01.F04 AS F0D,c01.F10 AS F1Z,c01.F12 ,c01.F13 AS F1C,a01.F03 as F0C FROM b05 
	        left outer join c01 on c01.F01=b05.F06
            left outer join a01 on a01.F01=b05.F09 			
			WHERE b05.F90='".$pgeno."' ORDER BY b05.F01 DESC";	   
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  
		$pgeno=substr(strrchr($_POST['filename'],'_'),1); // 月次
	    //$searchRecord =$_POST['filename'];
	 	$sql3="SELECT b05.F00,b05.F01,b05.F02,b05.F06,b05.F08,b05.F10,b05.F09,b05.F24,b05.F14,b05.F16,b05.F20,b05.F21,b05.F22,b05.F23,b05.F25,b05.F13,
	         c01.F05 as F0E,c01.F04 AS F0D,c01.F10 AS F1Z,c01.F12 ,c01.F13 AS F1C,a01.F03 as F0C FROM b05 
	        left outer join c01 on c01.F01=b05.F06 
            left outer join a01 on a01.F01=b05.F09 	
		    WHERE b05.F90='".$pgeno."' and ".$fieldNo." like '%".trim($filterKey)."%' order by '".$fieldNo."', b05.F02"; 
    }	   
    $sql0="select * from a23 where F01='".$pgeno."'"; 
    $sql1=@mysqli_query($link,$sql0);                           
    $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表        
     $wthary=fldwdthpre('B05','1',$link); 	
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F01','F06','F0E','F0D','F1Z','F12','F1C','F02','F09','F0C','F08','F21','F20','F22','F23','F14',
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

 