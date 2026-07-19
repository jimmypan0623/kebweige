<?php
   header("Content-Type: application/json; charset=utf-8");
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔
    require_once "../../include/BKND/fieldpreset.php"; // 引入  
   $sq20="select * from a26 where F01='INT_069' "; 
     $sql7=@mysqli_query($link,$sq20);
    // $rows7=@mysqli_num_rows($sql7);                       
     $list8=mysqli_fetch_assoc($sql7);  //紀錄參數  	
   $rnddgt=$list8['F06'];//$_COOKIE["INT_069"];
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $dptno=substr(strrchr($_POST['filename'],'|'),1); // 月次
	    
        if(substr($dptno,0,1)=='3'){
		   $sql3="SELECT k25.*,c01.F05 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		   $sql3.="LEFT JOIN c01 ON c01.F01=k25.F03 ";
		}else{			
		   $sql3="SELECT k25.*,d01.F04 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		   $sql3.="LEFT JOIN d01 ON d01.F01=k25.F03 ";
		}
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 "; 
		 
		$sql3.="WHERE k25.F90='".$pgeno."' AND k25.F01='".$dptno."' ";
		$sql3.="ORDER BY k25.F02,k25.F07 ";	
		     
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  		
	    $pgeno=getNeedBetween($_POST['filename'],'_','~'); // 月次 
		$dptno=substr(strrchr($_POST['filename'],'~'),1);  //發票類別
       if(substr($dptno,0,1)=='3'){
		   $sql3="SELECT k25.*,c01.F05 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		    $sql3.="LEFT JOIN c01 ON c01.F01=k25.F03 ";
		}else{
		   $sql3="SELECT k25.*,d01.F04 AS F0E,a14.F02 AS F0B,a01.F03 AS F0C FROM k25 ";
		   $sql3.="LEFT JOIN d01 ON d01.F01=k25.F03 ";
		}	   
		
		 
		$sql3.="LEFT JOIN a14 ON a14.F01=k25.F14 ";
		$sql3.="LEFT JOIN a01 ON a01.F01=k25.F19 ";
		$sql3.="WHERE k25.F90='".$pgeno."' AND k25.F01='".$dptno."' ";
		$sql3.="AND ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo;   
             
   }	   
     $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前月份是否已結轉月庫存報表   
 //	 'objtname_DSL_007'=>$list3['F0E'],
    $wthary=fldwdthpre('K17','1',$link);
	$arr=array();	
    $result=@mysqli_query($link,$sql3); 
	$afld=['F00','F02','F07','F03','F0E','F04','F09','F21','F22','F08','F10','F12','F15','F14','F0B','F19','F0C','F24'];
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

 