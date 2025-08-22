<?php

   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔   
        $fieldNo=substr($_POST['filename'],0,7);                //料號欄位key
		
		$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋料號 

		$customno=trim(substr(strrchr($_POST['filename'],'_'),1));   //客戶編號
		 
	  $searchRecord =trim($filterKey);		
	 $sql3="SELECT b01.F01,b01.F02,b01.F04,c20.F03,c20.F15,c34.F03 as F0C FROM b01 ";	 
	 $sql3.="left outer join c20 on c20.F01=b01.F01 ";
	 $sql3.="left outer join c34 on c34.F02=b01.F01 and c34.F01='".$customno."' ";	
	 if(strlen($searchRecord)==0) {	  
         $sql3=$sql3."WHERE RIGHT(F98,1)='Y' OR F98='NNN' ";		
	 }else{

		$sql3=$sql3."WHERE ".$fieldNo." like '%".$searchRecord."%' AND (RIGHT(F98,1)='Y' OR F98='NNN') "   ; 
	 }
	 $sql3=$sql3."order by ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('stock_no'=>$list3['F01'],  		            	             
		             'stock_name'=>$list3['F02'],
					 'unit_name'=>$list3['F04'],
					 'basic_qty'=>$list3['F03'],
					 'minum_qty'=>$list3['F15'],
					 'custom_part'=>$list3['F0C']
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
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

 