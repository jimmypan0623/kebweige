<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");         //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入
   $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 	        
	   $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;	        
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);  //每頁筆數
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){                   //如果沒有那就是初次進來所以要計算$total_pages數字
		  $sqlK="SELECT F01 FROM `a01` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT a01.F00,a01.F01,a01.F02,a01.F03,a01.F04,a14.F02 as F0B,a01.F07,a01.F10,a01.F12,a01.F13,a01.F99 FROM `a01` LEFT JOIN `a14` ON  a14.F01=a01.F04 order by a01.F01 ";
	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
		$sql3="SELECT a01.F00,a01.F01,a01.F03,a01.F04,a14.F02 as F0B,a01.F07,a01.F10,a01.F12,a01.F13,a01.F99 FROM `a01` LEFT JOIN `a14` ON a14.F01=a01.F04 WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
    $wthary=fldwdthpre('A02','1',$link);
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F01','F03','F04','F0B','F07','F10','F12','F13','F99'];
    $arr=afldcont($result,$afld,$wthary);
	
	mysqli_close($link);
	   
          $arr = array_values($arr);
      
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$rows));		 
 
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

 