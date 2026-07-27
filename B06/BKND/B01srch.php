<?php
require_once("../../include/BKND/auth_check.php"); //驗證
    header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔  
    require_once "../../include/BKND/fieldpreset.php";		
    $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key		
	//$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 
	//$customno=trim(substr(strrchr($_POST['filename'],'_'),1));   //客戶編號	
    $filterKey=trim(substr(strrchr($_POST['filename'],'|'),1));  // 搜尋料號或品名 	
	$searchRecord =trim($filterKey);			
	$sql3="SELECT b01.F01,b01.F02 FROM b01 ";
	 
	if(strlen($searchRecord)==0) {	  
        $sql3=$sql3."WHERE b01.F98<>'NNN' ";		
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".trim($searchRecord)."%' AND b01.F98<>'NNN' "; 
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;
     
    $result=@mysqli_query($link,$sql3); 
 
	$wthary = fldwdthpre('B06', 'M', $link);
    $afld=['F01','F02'];
    $arr=afldcont($result,$afld,$wthary);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    

          
?>  

 