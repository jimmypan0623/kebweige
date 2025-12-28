<?php   
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array

$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 include("../../include/BKND/mysqli_server.php");                              //引用檔    

 $sql7="select F10 from k08 where F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過  (int)$brr[7]
if($list2['F10']!='Y'){	 	
	 $sqlfd="SELECT ".$brr[7]." - (SELECT SUM(k0h.F05) FROM k0h GROUP BY k0h.F01 HAVING k0h.F01='".$brr[0]."') AS FDI ";
	 $sqldi=@mysqli_query($link,$sqlfd);                       
     $fdi=mysqli_fetch_assoc($sqldi);  //檢查是否收款金額與沖帳不符
    if($fdi['FDI']==0){				 
		 $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."' ";
		 $sql1=@mysqli_query($link,$sql0);
		 $rows1=@mysqli_num_rows($sql1);                       
		 $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
		 $lastdate=date('Y'.'-'.'m'.'-'.'d');
		 
			$k25update1="UPDATE k25 SET k25.F28=k25.F28+(-1)
		   *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F01='".$brr[0]."') 
		   WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F01='".$brr[0]."')";
		   mysqli_query($link ,$k25update1) or die(mysqli_error($link));    
		   
			  $k25update2="UPDATE k25 SET k25.F27=k25.F27+(1)
		   *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F01='".$brr[0]."') 
		   WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F01='".$brr[0]."')";
		   mysqli_query($link ,$k25update2) or die(mysqli_error($link));    
		   
		$mscnt="UPDATE k08 SET F10='Y',";	    	  
		$mscnt.=" F13='".$lastdate.$list4['F03']."'";
		
		$mscnt.=" WHERE F01='".$brr[0]."'";
														//寫入MySQL 	 
		mysqli_query($link ,$mscnt) or die(mysqli_error($link));  	  

		$arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
		echo json_encode($arr); 
	}else{
		echo json_encode("收款總金額與沖帳總金額不符，請修改內容後再確認！");  
	}	
}else{
	 echo json_encode("此沖銷單已被確認過(.|.)"); 
} 
mysqli_close($link);	
 	
?>
 