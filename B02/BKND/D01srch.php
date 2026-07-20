<?php
require_once("../../include/BKND/auth_check.php"); //驗證
    header("Content-Type: application/json; charset=utf-8");
    header("Cache-Control: no-cache, must-revalidate");
    header("Pragma: no-cache");

  require_once("../../include/BKND/mysqli_server.php");                              //引用檔  
  require_once "../../include/BKND/fieldpreset.php";
        $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT d01.F01,d01.F03,d01.F04,d01.F06,d01.F09,d01.F25,d01.F19,d01.F39,a01.F03 as F0C,d01.F08,d01.F15,d01.F36,d00.F02 as F0B FROM d01 ";	 
	 $sql3=$sql3."LEFT OUTER join a01 ON d01.F39=a01.F01 ";
	  $sql3=$sql3."LEFT OUTER join d00 ON d01.F25=d00.F01 ";
	 if(strlen($searchRecord)==0) {	          
		  $sql3=$sql3."WHERE d01.F01 IN (SELECT F03 FROM d03 WHERE F04='Y' AND F01 IN(SELECT F01 FROM d04 WHERE F03-F09-F21-F23>0 )) ";
	 }else{
	    $sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' and d01.F01 IN (SELECT F03 FROM d03 WHERE F04='Y' AND F01 in(SELECT F01 FROM d04 WHERE F03-F09-F21-F23>0 ))"; 
	 }
	 $sql3=$sql3."ORDER BY ".$fieldNo;
    $arr=array();	
    $result=@mysqli_query($link,$sql3); 
	
	$wthary = fldwdthpre('B02', 'V', $link);
    $afld=['F01','F04','F39','F0C','F25','F08','F15','F36','F19','F0B','F03','F06','F09'];
    $arr=afldcont($result,$afld,$wthary);

	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
        
?>  

 