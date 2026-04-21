<?php

    header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
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
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array(
		             'stock_no_ISL_050'=>$list3['F01'],  		            	             
		             'stock_name_ISL_050'=>$list3['F02']					  
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    

          
?>  

 