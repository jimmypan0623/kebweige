<?php
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入    
   $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
	   $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `d02` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT d02.F00,d02.F01,d02.F02,d02.F03,d02.F04,d02.F06,d02.F07,d02.F08,d02.F10,d02.F11,d02.F13,d02.F15,d02.F16,d02.F99,d01.F04 as F0E FROM d02"; 	   
	   $sql.=" left outer join d01 on d01.F01=d02.F01"; 	
	   $sql.=" ORDER BY d02.F03,d02.F01,d02.F02 desc";	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
	    
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	    //$searchRecord =$_POST['filename'];
		$sql="SELECT d02.F00,d02.F01,d02.F02,d02.F03,d02.F04,d02.F06,d02.F07,d02.F08,d02.F10,d02.F11,d02.F13,d02.F15,d02.F16,d02.F99,d01.F04 as F0E FROM d02"; 	   
	    $sql.=" left outer join d01 on d01.F01=d02.F01"; 	  
		$sql3=$sql." WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
    $wthary=fldwdthpre('D02','1',$link); 
	$arr=array();	
    $result=@mysqli_query($link,$sql3);
	$afld=['F00','F03','F01','F0E','F04','F06','F07','F08','F13','F10','F11','F02','F15','F16','F99'];
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

 