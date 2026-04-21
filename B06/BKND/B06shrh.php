<?php   
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$rnddgt=intval($_COOKIE["INT_069"]);
$taxrate=intval($_COOKIE["INT_002"]);
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 require_once("../../include/BKND/mysqli_server.php");                              //引用檔    
 require_once "../../include/BKND/paymentclc.php"; // 引入 
 $sql7="select F10 from b06 where F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
 if($list2['F10']!='Y'){
    $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
                           
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名        
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
	 
	 
	 
	 
	 $sql3="SELECT b0f.*, a1A.F02 as F0B,a1B.F02 AS F0C FROM b0f  	 
	 LEFT OUTER JOIN `a14` AS a1A  ON a1A.F01='".$brr[2]."'
	 LEFT OUTER JOIN `a14` AS a1B  ON a1B.F01='".$brr[3]."' WHERE b0f.F01='".$brr[0]."' ORDER BY b0f.F03"; 
	 $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	 while ($list3=mysqli_fetch_assoc($sql4)){
		 $my_array  = array('query_no'=>$list3['F01'],			              
					    'stockno'=>$list3['F03'],
					    'deliveryday'=>$brr[1],
					    'orderqty'=>$list3['F04'],					   
					    'lastupdate'=>$lastdate.$list4['F03'],
					    'departno'=>$brr[2],
						'departname'=>$list3['F0B'],
					    'receivendpt'=>$brr[3],		
						'rcvdptname'=>$list3['F0C'],		
					    'remark'=>$brr[4],					    
					    'month_no'=>$brr[6] 
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

			/////// 			   //轉出
		     $valueStr2 .= "('".$v['stockno']."',
		     '".$v['departno']."',
		     '".$v['deliveryday']."',
		     ".$v['orderqty']*(-1).",
		     '".$v['lastupdate']."',
		     '".'移轉單'."',
		     '".$v['query_no']."',		 
		     '".'至'.$brr[3].$v['rcvdptname']."',			
		     '".$v['month_no']."'),";
		 ////////
		     $valueStr3 .= "('".$v['departno']."',
		     '".$v['stockno']."',
		     ".$v['orderqty'].",
		     ".$v['orderqty']*(-1).",
		     '".$v['lastupdate']."',
	         '".$v['month_no']."'),";
		 /////////
		     $valueStr4 .= "('".$v['departno']."',
		     '".$v['stockno']."',
		     ".$v['orderqty']*(-1).",
		     '".$v['month_no']."-".$v['deliveryday']."'),";		
		/////// 			   //轉入
		     $valueStr5 .= "('".$v['stockno']."',
		     '".$v['receivendpt']."',
		     '".$v['deliveryday']."',
		     ".$v['orderqty'].",
		     '".$v['lastupdate']."',
		     '".'移轉單'."',
		     '".$v['query_no']."',		 
		     '".'從'.$brr[2].$v['departname']."',			
		     '".$v['month_no']."'),";
		 ////////
		     $valueStr6 .= "('".$v['receivendpt']."',
		     '".$v['stockno']."',
		     ".$v['orderqty'].",
		     ".$v['orderqty'].",
		     '".$v['lastupdate']."',
	         '".$v['month_no']."'),";
		 /////////
		     $valueStr7 .= "('".$v['receivendpt']."',
		     '".$v['stockno']."',
		     ".$v['orderqty'].",
		     '".$v['month_no']."-".$v['deliveryday']."'),";
		 //////
		
	 	      
    }
	
    
	
	$valueStr2 = substr($valueStr2,0,strlen($valueStr2)-1);   //去掉最右邊的逗號,異動庫存異動表
	$valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
	$valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細
	
	$valueStr5 = substr($valueStr5,0,strlen($valueStr5)-1);   //去掉最右邊的逗號,異動庫存異動表
	$valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動庫存月報表
	$valueStr7 = substr($valueStr7,0,strlen($valueStr7)-1);   //去掉最右邊的逗號,異動即時庫存明細
	
	$insertSql[] = "insert into b26 (F01,F02,F03,F04,F05,F06,F07,F08,F90) values ".$valueStr2; 
	$insertSql[] = "insert into b25 (F01,F02,F09,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F09=F09+VALUES(F09),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
	$insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     
	
    $insertSql[] = "insert into b26 (F01,F02,F03,F04,F05,F06,F07,F08,F90) values ".$valueStr5; 
	$insertSql[] = "insert into b25 (F01,F02,F08,F15,F16,F90) values ".$valueStr6." ON DUPLICATE KEY UPDATE F08=F08+VALUES(F08),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
	$insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr7." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     

	
	foreach ($insertSql as  $values){
		    @mysqli_query($link,$values);
	}

	$mscnt="UPDATE b06 SET F10='".$brr[5]."',";	    	  
	$mscnt.=" F11='".$lastdate.$list4['F03']."'";	
	$mscnt.=" WHERE F01="."'".$brr[0]."'";
	$sql=$mscnt;                                                 //寫入MySQL 	 
    mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
    $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	echo json_encode($arr); 
}else{
	   echo json_encode("此移轉單已被確認過(.|.)"); 
} 
mysqli_close($link);	
 	
?>
 