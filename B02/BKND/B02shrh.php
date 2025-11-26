<?php   
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 include("../../include/BKND/mysqli_server.php");                              //引用檔    
 $sql7="SELECT F10 FROM b02 WHERE F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
 if($list2['F10']!='Y'){
     $sql0="SELECT * FROM a01 WHERE F01='".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
	   $sql3="SELECT `b0b`.*,`d01`.`F04` AS F0D,`d01`.`F13` AS F1C,`d01`.`F15` AS F1E,`b01`.`F98` FROM `b0b`,`d01`,`b01` WHERE `b0b`.`F01`='".$brr[0]."' and `d01`.`F01`='".$brr[1]."' AND `b01`.`F01`= `b0b`.`F03` order by b0b.F03"; 
	 $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	 while ($list3=mysqli_fetch_assoc($sql4)){
		 $my_array  = array('query_no'=>$list3['F01'],			              
					    'stockno'=>$list3['F03'],
					    'deliveryday'=>$brr[2],
					    'orderqty'=>$list3['F04'],
					    'vendor_no'=>$brr[1], 
					    'vendor_name'=>$list3['F0D'],
					    'check_way'=>$list3['F1C'],
					    'oring_no'=>$list3['F07'],
					    'crncy_no'=>$brr[4],
					    'unit_price'=>$list3['F15'],
					    'crncy_rate'=>$brr[5],
					    'lastupdate'=>$lastdate.$list4['F03'],
					    'departno'=>$list3['F05'],
					    'salesno'=>$brr[3],											
		                'vendorer_po'=>$list3['F09'],
					    'vendor_partno'=>$list3['F08'],					   
					    'remark'=>$brr[11],
					    'invoice_no'=>$brr[6],
					    'invoice_type'=>$brr[7],
					    'tax_type'=>$brr[8],
						'settle_day'=>$list3['F1E'],
						'mrt_type'=>$list3['F98'],
					    'month_no'=>$brr[13] 
                     );   		     
			array_push($arr,$my_array);		          		
	}
     $valueStr1 ='';
	 $valueStr2 ='';
	 $valueStr3 ='';
	 $valueStr4 ='';
	 $valueStr5 ='';
	 $valueStr6 ='';
        foreach($arr as $v){
			if($v['mrt_type']=='NNN'){  //如果是虛擬料號	
		       $vbn=0;
		    }else{
		       $vbn=1;
		    }
             $valueStr1 .= "('".$v['deliveryday']."',
		    '".$v['vendor_no']."',
		    '".$v['stockno']."',
		    '".$v['query_no']."',
		    '".$v['oring_no']."',
		    '".$v['crncy_no']."',
		    '".$v['unit_price']."',
		    ".$v['orderqty'].",
		    '".$v['crncy_rate']."',			
		    '".$v['salesno']."',		   
			'".$v['departno']."',	
		    '".$v['vendorer_po']."',
		    '".$v['vendor_partno']."',
		    '".$v['lastupdate']."', 	
		    '".$v['month_no']."'),";
			/////// 			 
		     $valueStr2 .= "('".$v['stockno']."',
		     '".$v['departno']."',
		     '".$v['deliveryday']."',
		     ".$v['orderqty']*$vbn.",
		     '".$v['lastupdate']."',
		     '".'進貨單'."',
		     '".$v['query_no']."',		 
		     '".'出'.$brr[1].$v['vendor_name']."',			
		     '".$v['month_no']."'),";
		 ////////
		     $valueStr3 .= "('".$v['departno']."',
		     '".$v['stockno']."',
		     ".$v['orderqty']*$vbn.",
		     ".$v['orderqty']*$vbn.",
		     '".$v['lastupdate']."',
	         '".$v['month_no']."'),";
		 /////////
		     $valueStr4 .= "('".$v['departno']."',
		     '".$v['stockno']."',
		     ".$v['orderqty']*$vbn.",
		     '".$v['month_no']."-".$v['deliveryday']."'),";
		 //////
		     $valueStr5 .= "('".$v['month_no']."-".$v['deliveryday']."',
		     '".$v['query_no']."',
	    	 '".$v['vendor_no']."',
	    	 '".$v['oring_no']."',
	    	 '".$v['stockno']."',
		     ".$v['orderqty'].",
	    	 ".$v['unit_price'].",
	    	 '".$v['check_way']."',
	    	 '".$v['lastupdate']."',			
	    	 '".$v['crncy_no']."',
	    	 ".$v['crncy_rate'].",
	    	 '".$v['remark']."',		          
             '".(($v['invoice_type']=='22' && $v['tax_type']=='1')?"02":"00")."', 			 
	    	 '".$v['invoice_no']."',		
	      	 '".$v['salesno']."',		
	    	 '".($v['deliveryday']<=$v['settle_day']?$v['month_no']:mnthPlus($v['month_no']))."'),";
         /////
	    	 $valueStr6 .= "('".$v['oring_no']."',
	    	 '".$v['stockno']."',		    
	    	 ".$v['orderqty'].",
			 ".$v['unit_price'].",
			 '".$v['vendor_partno']."',
		     '".$v['month_no']."-".$v['deliveryday']."',
		     ".$v['orderqty'].",
		     '".$v['lastupdate']."',
	    	 ".$v['orderqty']*(-1)."),"; 			      
        }   
     $valueStr1 = substr($valueStr1,0,strlen($valueStr1)-1);   //去掉最右邊的逗號,新增出貨月報表
     $valueStr2 = substr($valueStr2,0,strlen($valueStr2)-1);   //去掉最右邊的逗號,異動庫存異動表
	 $valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
	 $valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細
	 $valueStr5 = substr($valueStr5,0,strlen($valueStr5)-1);   //去掉最右邊的逗號,新增應收帳款對帳單
	 $valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動客戶訂單表身
     $insertSql[] = "insert into d11 (F01,F02,F03,F04,F05,F06,F07,F08,F09,F10,F15,F16,F17,F19,F90) values ".$valueStr1;       
	 $insertSql[] = "insert into b26 (F01,F02,F03,F04,F05,F06,F07,F08,F90) values ".$valueStr2; 
	 $insertSql[] = "insert into b25 (F01,F02,F04,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
	 $insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     
	 $insertSql[] = "insert into d19 (F01,F02,F03,F04,F05,F06,F07,F09,F12,F13,F14,F15,F16,F17,F19,F90) values ".$valueStr5;      
     $insertSql[] = "insert into d04 (F01,F02,F03,F04,F05,F06,F09,F12,F23) values ".$valueStr6." ON DUPLICATE KEY UPDATE F09=F09+VALUES(F09),F12=VALUES(F12),F23=F23+VALUES(F23)";
     foreach ($insertSql as  $values){
		    @mysqli_query($link,$values);
	}
	   
	   $mscnt="UPDATE d01 SET F14='".$brr[13]."-".$brr[2]."' " ;
	   $mscnt.="WHERE F01='".$brr[1]."' AND (F14<'".$brr[13]."-".$brr[2]."' OR F14 IS NULL)" ;
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
	   
	   $mscnt="UPDATE b02 SET F10='".$brr[12]."',";	    	  
	   $mscnt.=" F11='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr); 
}else{
	   echo json_encode("此進貨單已被確認過"); 
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
 