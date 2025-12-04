<?php
   header("Content-Type:text/html; charset=utf-8");   

    include("../../include/BKND/mysqli_server.php");         //引用檔   
	$fieldNo=substr($_POST['filename'],0,7);                //程式欄位key		
	$filterKey=trim(getNeedBetween($_POST['filename'],'|','_')); // 搜尋程式 
	$accntno=trim(substr(strrchr($_POST['filename'],'_'),1));   //帳號		 
	$searchRecord =trim($filterKey);		
	$sql3="SELECT `F01`,`F02`,`F04`,`F05`,`F06`,`F07`,`F08`,`F09`,`F10`,`F11`,`F12`,`F15` FROM `a03` ";	 		
	if(strlen($searchRecord)==0) {	  
         $sql3=$sql3."WHERE `F01` NOT IN (SELECT `F03` FROM a02 WHERE `F01`='".$accntno."') ";	
	}else{
		$sql3=$sql3."WHERE ".$fieldNo." LIKE '%".$searchRecord."%' AND `F01` NOT IN (SELECT `F03` FROM a02 WHERE `F01`='".$accntno."') ";		
	}
	$sql3=$sql3."ORDER BY ".$fieldNo;
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		 
		$atr = array('prg_no_ISC_020'=>$list3['F01'],  		            	             
		             'prg_name_ISL_080'=>$list3['F02'],					               
                     'new_auth_IHC_000'=>$list3['F04'],
                     'edit_auth_IHC_000'=>$list3['F05'],
					 'del_auth_IHC_000'=>$list3['F06'],
					 'prnt_auth_IHC_000'=>$list3['F07'],
					 'auth1_attch_IHC_000'=>$list3['F08'],
					 'auth2_attch_IHC_000'=>$list3['F09'],
					 'auth3_attch_IHC_000'=>$list3['F10'],
					 'auth4_attch_IHC_000'=>$list3['F11'],
                     'attch5_attch_IHC_000'=>$list3['F12']);          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
 
       
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

 