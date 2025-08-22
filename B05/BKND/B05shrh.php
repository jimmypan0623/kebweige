<?php   
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");                              //引用檔   
 $sql7="select F10 from b04 where F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_array($sql8);  //檢查是否已確認過
 if($list2['F10']!='Y'){
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
	 $sql3="select b0d.*,c01.F23,c01.F05 as F0E,c01.F15 as F1E,c01.F17 from b0d,c01 where b0d.F01='".$brr[0]."' and c01.F01='".$brr[1]."' order by b0d.F03"; 
 
	 
	 $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	 while ($list3=mysqli_fetch_array($sql4)){
		 $my_array  = array('query_no'=>$list3['F01'],			              
					    'stockno'=>$list3['F03'],
					    'deliveryday'=>$brr[2],
					    'orderqty'=>$list3['F04'],
					    'custom_no'=>$brr[1], 
					    'custom_name'=>$list3['F0E'],
					    'check_way'=>$list3['F1E'],
					    'oring_no'=>$list3['F07'],
					    'crncy_no'=>$brr[4],
					    'unit_price'=>$list3['F15'],
					    'crncy_rate'=>$brr[5],
					    'lastupdate'=>$lastdate.$list4['F03'],
					    'departno'=>$list3['F05'],
					    'salesno'=>$brr[3],					
						'assissno'=>$list3['F23'],	
		                'customer_po'=>$list3['F09'],
					    'custom_partno'=>$list3['F08'],					   
					    'remark'=>$brr[11],
					    'invoice_no'=>$brr[6],
					    'invoice_type'=>$brr[7],
					    'tax_type'=>$brr[8],
						'settle_day'=>$list3['F17'],
					    'month_no'=>$brr[13] 
                     );   		     
			array_push($arr,$my_array);		          		
	}

	 $valueStr2 ='';
	 $valueStr3 ='';
	 $valueStr4 ='';
	 $valueStr5 ='';
	 $valueStr6 ='';
        foreach($arr as $v){
     
		     $valueStr2 .= "('".$v['stockno']."',
		     '".$v['departno']."',
		     '".$v['deliveryday']."',
		     ".$v['orderqty']*(-1).",
		     '".$v['lastupdate']."',
		     '".'出貨單'."',
		     '".$v['query_no']."',		 
		     '".'出'.$brr[1].$v['custom_name']."',			
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
		 //////
		     $valueStr5 .= "('".$v['month_no']."-".$v['deliveryday']."',
		     '".$v['query_no']."',
	    	 '".$v['custom_no']."',
	    	 '".$v['oring_no']."',
	    	 '".$v['stockno']."',
		     ".$v['orderqty'].",
	    	 ".$v['unit_price'].",
	    	 '".$v['check_way']."',
	    	 '".$v['lastupdate']."',			
	    	 '".$v['crncy_no']."',
	    	 ".$v['crncy_rate'].",
	    	 '".$v['remark']."',		          
             '".(($v['invoice_type']=='32' && $v['tax_type']=='1')?"02":"00")."', 			 
	    	 '".$v['invoice_no']."',		
	      	 '".$v['salesno']."',		
	    	 '".($v['deliveryday']<=$v['settle_day']?$v['month_no']:mnthPlus($v['month_no']))."'),";
         /////
	    	 $valueStr6 .= "('".$v['oring_no']."',
	    	 '".$v['stockno']."',		    
	    	 ".$v['orderqty'].",
			 ".$v['unit_price'].",
			 '".$v['custom_partno']."',
		     '".$v['month_no']."-".$v['deliveryday']."',
		     ".$v['orderqty'].",
		     '".$v['lastupdate']."',
	    	 ".$v['orderqty']*(-1)."),"; 			      
        }  
 
 
    $valueStr2 = substr($valueStr2,0,strlen($valueStr2)-1);   //去掉最右邊的逗號,異動庫存異動表
	 $valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
	 $valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細
	 $valueStr5 = substr($valueStr5,0,strlen($valueStr5)-1);   //去掉最右邊的逗號,新增應收帳款對帳單
	 $valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動客戶訂單表身
      
	 $insertSql2 = "insert into b26 (F01,F02,F03,F04,F05,F06,F07,F08,F90) values ".$valueStr2; 
	 $insertSql3 = "insert into b25 (F01,F02,F06,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F06=F06+VALUES(F06),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
	 $insertSql4 = "insert into b11 (F01,F03,F04,F05) values ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     
	 $insertSql5 = "insert into c13 (F01,F02,F03,F04,F05,F06,F07,F09,F12,F13,F14,F15,F16,F17,F19,F90) values ".$valueStr5;      
     $insertSql6 = "insert into c04 (F01,F02,F03,F04,F05,F06,F09,F12,F23) values ".$valueStr6." ON DUPLICATE KEY UPDATE F09=F09+VALUES(F09),F12=VALUES(F12),F23=F23+VALUES(F23)";
 
       @mysqli_query($link,$insertSql2) ;  
	   @mysqli_query($link,$insertSql3) ;  
	   @mysqli_query($link,$insertSql4) ;  
	   @mysqli_query($link,$insertSql5) ;  
	   @mysqli_query($link,$insertSql6) ;
	   
	   $mscnt="UPDATE c01 SET F16='".$brr[13]."-".$brr[2]."' " ;
	   $mscnt.="WHERE F01='".$brr[1]."' AND (F16<'".$brr[13]."-".$brr[2]."' OR F16 IS NULL)" ;
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
	   
	   $mscnt="UPDATE b04 SET F10='".$brr[12]."',";	    	  
	   $mscnt.=" F11='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr); 
}else{
	   echo json_encode("此出貨單已被確認過"); 
} 
mysqli_close($link);	
 	
	
function mnthPlus($yearmonth ){    //計算超過結帳日期的結帳月份

    $nextMonth = (int)substr($yearmonth, -2) + 1;

    if ($nextMonth > 12) {
       $Month = '01';
       $nextYear=(int)substr($yearmonth, 0, 4) + 1;
	   $Year=(string)$nextYear;
    }else{
	   $Month=str_pad((string)$nextMonth,2,'0',STR_PAD_LEFT);
	   $Year=substr($yearmonth, 0, 4);
	}
	
	return $Year.'-'.$Month;
}	
	
?>
 