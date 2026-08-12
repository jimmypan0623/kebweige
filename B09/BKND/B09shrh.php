<?php   
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 require_once("../../include/BKND/mysqli_server.php");                              //引用檔    
 require_once "../../include/BKND/paymentclc.php"; // 引入 
 $sql7="select F10 from b09 where F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
 if($list2['F10']!='Y'){
    
     $lastdate=date('Y'.'-'.'m'.'-'.'d'); 
	 $sql3="SELECT b0i.*, a14.F02 as F0B FROM b0i  	 
	 LEFT OUTER JOIN `a14` ON a14.F01='".$brr[2]."' WHERE b0i.F01='".$brr[0]."' ORDER BY b0i.F03"; 
	 $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	 while ($list3=mysqli_fetch_assoc($sql4)){
		 $my_array  = array('query_no'=>$list3['F01'],			              
					    'stockno'=>$list3['F03'],
					    'deliveryday'=>$brr[1],
					    'orderqty'=>$list3['F04'],					   
					    'lastupdate'=>$lastdate.$_SESSION['user_name'],
					    'departno'=>$brr[2],
						'departname'=>$list3['F0B'],					    	
					    'remark'=>$brr[3],					    
					    'month_no'=>$brr[5] 
                     );   		     
			array_push($arr,$my_array);		           
	}
     
	 $valueStr2 ='';
	 $valueStr3 ='';
	 $valueStr4 ='';
	 $valueStr5 ='';
	 $valueStr6 ='';
	 $valueStr7 ='';
	 
    foreach($arr as $v){

		
		/////// 			   //盤差
		     $valueStr5 .= "('".$v['stockno']."',
		     '".$v['departno']."',
		     '".$v['deliveryday']."',
		     ".$v['orderqty'].",
		     '".$v['lastupdate']."',
		     '".'盤差調整轉單'."',
		     '".$v['query_no']."',		 
		     '".$v['remark']."',			
		     '".$v['month_no']."'),";
		 ////////
		     $valueStr6 .= "('".$v['departno']."',
		     '".$v['stockno']."',
		     ".$v['orderqty'].",
		     ".$v['orderqty'].",
		     '".$v['lastupdate']."',
	         '".$v['month_no']."'),";
		 /////////
		     $valueStr7 .= "('".$v['departno']."',
		     '".$v['stockno']."',
		     ".$v['orderqty'].",
		     '".$v['month_no']."-".$v['deliveryday']."'),";
		 //////
		
	 	      
    }

	
	$valueStr5 = substr($valueStr5,0,strlen($valueStr5)-1);   //去掉最右邊的逗號,異動庫存異動表
	$valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動庫存月報表
	$valueStr7 = substr($valueStr7,0,strlen($valueStr7)-1);   //去掉最右邊的逗號,異動即時庫存明細
	
	
    $insertSql[] = "insert into b26 (F01,F02,F03,F04,F05,F06,F07,F08,F90) values ".$valueStr5; 
	$insertSql[] = "insert into b25 (F01,F02,F13,F15,F16,F90) values ".$valueStr6." ON DUPLICATE KEY UPDATE F13=F13+VALUES(F13),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
	$insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr7." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     

	
	foreach ($insertSql as  $values){
		    @mysqli_query($link,$values);
	}

	$mscnt="UPDATE b09 SET F10='".$brr[4]."',";	    	  
	$mscnt.=" F11='".$lastdate.$_SESSION['user_name']."'";	
	$mscnt.=" WHERE F01="."'".$brr[0]."'";
	$sql=$mscnt;                                                 //寫入MySQL 	 
    mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
    $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$_SESSION['user_name']);     
	echo json_encode($arr); 
}else{
	   echo json_encode("此移轉單已被確認過(.|.)"); 
} 
mysqli_close($link);	
 	
?>
 