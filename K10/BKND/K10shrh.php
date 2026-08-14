<?php   
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$cart=json_decode($str_json);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 require_once("../../include/BKND/mysqli_server.php");                              //引用檔    

 $sql7="select F10 from k08 where F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過  (int)$brr[7]
if($list2['F10']!='Y'){	 	
	 $sqlfd="SELECT ".$brr[7]." - (SELECT SUM(k0h.F05) FROM k0h GROUP BY k0h.F01 HAVING k0h.F01='".$brr[0]."') AS FDI ";
	 $sqldi=@mysqli_query($link,$sqlfd);                       
     $fdi=mysqli_fetch_assoc($sqldi);  //檢查是否收款金額與沖帳不符
    if($fdi['FDI']==0){				 
		 
		 $lastdate=date('Y'.'-'.'m'.'-'.'d');
		 
		 $sql3="SELECT k0h.* FROM k0h WHERE k0h.F01='".$brr[0]."' ORDER BY k0h.F03"; 
	     $sql4=@mysqli_query($link,$sql3); 
         $arr=array(); 
		 
		
		    while ($list3=mysqli_fetch_assoc($sql4)){
		    $my_array  = array(			              
					    'billno'=>$list3['F03'],
						'invoice_no'=>$list3['F02'],
					    'writemoney'=>$list3['F05'],
					    'invoiceday'=>$list3['F14'],
						'writeno'=>$brr[0],
					    'custom_no'=>$brr[1], 
					    'writeday'=>$brr[2],
					    'salesno'=>$brr[3],				
						'payway'=>$brr[4],
						'checkno'=>$brr[5],
					    'cashday'=>$brr[6],
					    'month_no'=>$brr[10],					    
						'lastupdate'=>$lastdate.$_SESSION['user_name']
                     );   		     
			      array_push($arr,$my_array);		           
	        }
			
     $valueStr1 ='';
	foreach($arr as $v){
	     $valueStr1 .= "('".$v['writeno']."',
		    '".$v['custom_no']."',
		    '".$v['writeday']."',
		    '".$v['salesno']."',
		    '".$v['payway']."',
		    '".$v['checkno']."',		  
		    '".$v['cashday']."',
		    '".$v['invoice_no']."',			
		    '".$v['billno']."',
		    ".$v['writemoney'].",
			'".$v['invoiceday']."',		 
		    '3', 
			'".$v['lastupdate']."', 
		    '".$v['month_no']."'),";
	 }		 
	 $valueStr1 = substr($valueStr1,0,strlen($valueStr1)-1);   //去掉最右邊的逗號,新增出貨月報表
	 $insertSql[0] = "insert into k09 (F05,F02,F01,F11,F08,F09,F10,F04,F03,F07,F06,F22,F19,F90) values ".$valueStr1;
	 foreach ($insertSql as  $values){
		    @mysqli_query($link,$values);
	 }
			$k25update1="UPDATE k25 SET k25.F28=k25.F28+(-1)
		   *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F01='".$brr[0]."') 
		   WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F01='".$brr[0]."')";
		   mysqli_query($link ,$k25update1) or die(mysqli_error($link));    
		   
			  $k25update2="UPDATE k25 SET k25.F27=k25.F27+(1)
		   *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F01='".$brr[0]."') 
		   WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F01='".$brr[0]."')";
		   mysqli_query($link ,$k25update2) or die(mysqli_error($link));    
		   
		$mscnt="UPDATE k08 SET F10='Y',";	    	  
		$mscnt.=" F13='".$lastdate.$_SESSION['user_name']."'";
		
		$mscnt.=" WHERE F01='".$brr[0]."'";
														//寫入MySQL 	 
		mysqli_query($link ,$mscnt) or die(mysqli_error($link));  	  

		$arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$_SESSION['user_name']);
		echo json_encode($arr); 
	}else{
		echo json_encode("收款總金額與沖帳總金額不符，請修改內容後再確認！");  
	}	
}else{
	 echo json_encode("此沖銷單已被確認過(.|.)"); 
} 
mysqli_close($link);	
 	
?>
 