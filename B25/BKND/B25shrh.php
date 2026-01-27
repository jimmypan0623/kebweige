<?php   
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
/* $rnddgt=intval($_COOKIE["INT_069"]);
$taxrate=intval($_COOKIE["INT_002"]); */
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 include("../../include/BKND/mysqli_server.php");                              //引用檔    
 require_once "../../include/BKND/paymentclc.php"; // 引入 
 $sql7="select F07 from a23 where F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
 if($list2['F07']!='Y'){
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
                   
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d'); 
	 $NbMthtrn1=(int)substr($brr[0], 0, 4);
	 $NbDaytrn1=(int)substr($brr[0],-2);

	 $NbDaytrn1=$NbDaytrn1-1;
	 if($NbDaytrn1<0){
	     $NbDaytrn1=12;
		 $NbMthtrn1=$NbMthtrn1-1;
	 }
	 $lastMth=(string)$NbMthtrn1.'-'.str_pad((string)$NbDaytrn1,2,"0",STR_PAD_LEFT);
	 
	 
	 $sqla="SELECT F07 FROM a23 where F01='".$lastMth."' AND F07='N'"; 
     $sqlb=@mysqli_query($link,$sqla); 
	 $rows1=@mysqli_num_rows($sqlb);  
	 if($rows1>0){
		echo json_encode($lastMth."月份庫存尚未結轉");  
	 }else{

		  $NbMthtrn2=(int)substr($brr[0], 0, 4);
	      $NbDaytrn2=(int)substr($brr[0],-2);
		  $NbDaytrn2=$NbDaytrn2+1;
		 if($NbDaytrn2>12){
			 $NbDaytrn2=1;
			 $NbMthtrn2=$NbMthtrn2+1;
		 }
		 $nextMth=(string)$NbMthtrn2.'-'.str_pad((string)$NbDaytrn2,2,"0",STR_PAD_LEFT);
		 
		 $mscnt="UPDATE b25 SET F15=F04-F05-F06+F07+F08-F09+F10-F11+F13-F14,F03=0";	    	  
		 
		$mscnt.=" WHERE F90="."'".$nextMth."'";
		$sql=$mscnt;                                                 //寫入MySQL 	 
		mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
		 
		 
		 
		 $sql3="SELECT F01,F02,F15 FROM b25  WHERE F90='".$brr[0]."'  ORDER BY F01,F02"; 
		 $sql4=@mysqli_query($link,$sql3); 
		 $arr=array(); 

		 while ($list3=mysqli_fetch_assoc($sql4)){
			 $my_array  = array(	
							'departno'=>$list3['F01'],		 
							'stockno'=>$list3['F02'],
						  
							'orderqty'=>$list3['F15'],
						  
							'lastupdate'=>$lastdate.$list4['F03'],
						   
							
							'month_no'=>$nextMth 
						 );   		     
				array_push($arr,$my_array);		
			   
		}
	 
		 $valueStr3 ='';

		foreach($arr as $v){

				 $valueStr3 .= "('".$v['departno']."',
				 '".$v['stockno']."',
				 ".$v['orderqty'].",
				 ".$v['orderqty'].",
				 '".$v['lastupdate']."',
				 '".$v['month_no']."'),";
			
		}	     

		$valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表

		$insertSql[2] = "insert into b25 (F01,F02,F03,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F03=VALUES(F03),F15=VALUES(F15)+F04-F05-F06+F07+F08-F09+F10-F11+F13-F14,F16=VALUES(F16)"; 
		
		foreach ($insertSql as  $values){
				@mysqli_query($link,$values);
		}
			
		
		   
		$mscnt="UPDATE a23 SET F07='Y' ";	    	  
		 
		$mscnt.=" WHERE F01="."'".$brr[0]."'";
		$sql=$mscnt;                                                 //寫入MySQL 	 
		mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
		$arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
		echo json_encode($arr); 
	}
}else{
	   echo json_encode("此月份庫存已結轉"); 
} 
mysqli_close($link);	
 	
?>
 