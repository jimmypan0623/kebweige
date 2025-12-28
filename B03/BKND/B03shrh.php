<?php   
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$rnddgt=intval($_COOKIE["INT_068"]);
$taxrate=intval($_COOKIE["INT_002"]);
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");                              //引用檔   
require_once "../../include/BKND/paymentclc.php"; // 引入 
 $sql7="SELECT F10 FROM b03 WHERE F01='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
 if($list2['F10']!='Y'){
	  $sqlA="SELECT d04.F09,b0c.F04 FROM d04,b0c WHERE d04.F01=b0c.F07 AND d04.F02=b0c.F03 AND b0c.F01='".$brr[0]."' AND d04.F09-b0c.F04<0";
    $sqlB=@mysqli_query($link,$sqlA);
    $rowsA=@mysqli_num_rows($sqlB);    
	if($rowsA>0){
        $arr = array ('order_no'=>0,'lastupdate'=>'');
		echo json_encode($arr);  
	}else{ 
		 $sql0="SELECT * FROM a01 WHERE F01="."'".$_COOKIE['useraccount']."'"; 
		 $sql1=@mysqli_query($link,$sql0);
		 $rows1=@mysqli_num_rows($sql1);                       
		 $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
		 $lastdate=date('Y'.'-'.'m'.'-'.'d');
		 $mArlth=count($brr);  
		 $sql3="SELECT b0c.*,d01.F04 AS F0D,`d01`.`F06` AS F0F,d01.F13 AS F1C,d01.F15 AS F1E,`d01`.`F36`,b01.F98 FROM b0c,d01,b01 WHERE b0c.F01='".$brr[0]."' AND d01.F01='".$brr[1]."' AND b01.F01=b0c.F03 ORDER BY b0c.F03"; 	 
		 $sql4=@mysqli_query($link,$sql3); 
		 $arr=array(); 
		  $summoney=0;
		   $originmoney=0;
		  $regex = "/^[A-Z]{2}[0-9]{8}$/";       //判斷是否有正確的發票號碼的正規式
		 while ($list3=mysqli_fetch_assoc($sql4)){
			 $my_array  = array('query_no'=>$list3['F01'],			              
							'stockno'=>$list3['F03'],
							'deliveryday'=>$brr[2],
							'orderqty'=>$list3['F04'],
							'vendor_no'=>$brr[1], 
							'vendor_name'=>$list3['F0D'],
							'check_way'=>$list3['F1C'],
							'united_no'=>$list3['F0F'],
							'oring_no'=>$list3['F07'],
							'crncy_no'=>$brr[9],
							'unit_price'=>$list3['F15'],
							'crncy_rate'=>$brr[10],
							'lastupdate'=>$lastdate.$list4['F03'],
							'departno'=>$list3['F05'],
							'salesno'=>$brr[3],											
							'vendorer_po'=>$list3['F09'],
							'vendor_partno'=>$list3['F08'],					   
							'reshipdate'=>$list3['F12'], 
							'rjtordscnt'=>$brr[11],
							'cancelqty'=>($brr[11]=='2'?$list3['F04']:0),  //退回不補取消量	
							'remark'=>$brr[12],						
							'invoice_no'=>$brr[6],
							'invoice_type'=> (preg_match($regex, $brr[6])?$brr[7]:'00'),
					        'tax_type'=> (preg_match($regex, $brr[6])?$brr[8]:'0'),
							'settle_day'=>$list3['F1E'],
							'paymentdays'=>$list3['F36'],
							'mrt_type'=>$list3['F98'],
							'month_no'=>$brr[14] 
						 );   		     
				array_push($arr,$my_array);	
                 $summoney+=round($list3['F04']*$list3['F15']*$brr[10],$rnddgt);		
                	 $originmoney+=$list3['F04']*$list3['F15'];				 
		}
		 $valueStr1 ='';
		 $valueStr2 ='';
		 $valueStr3 ='';
		 $valueStr4 ='';
		 $valueStr5 ='';
		 $valueStr6 ='';
		 $tax_isinside="00";
		foreach($arr as $v){
			
			if($brr[11]!='3'){  //退貨
				if($v['mrt_type']=='NNN'){  //如果是虛擬料號	
				   $vbn=0;
				}else{
				   $vbn=1;
				}
				$tax_isinside=($v['invoice_type']=='24' && $v['tax_type']=='1')?"02":"00";  //稅是否內含
				$valueStr1 .= "('".$v['deliveryday']."',  
				'".$v['vendor_no']."',
				'".$v['stockno']."',
				'".$v['query_no']."',
				'".$v['oring_no']."',
				'".$v['crncy_no']."',
				'".($tax_isinside=='02'?round($v['unit_price']/(1+$taxrate/100),3):$v['unit_price'])."',
				'".$v['orderqty']*(-1)."',
				'".$v['crncy_rate']."',			
				'".$v['salesno']."',
				'".$v['departno']."',
				'".$v['vendorer_po']."',
				'".$v['vendor_partno']."',
				'".$v['lastupdate']."', 	
				'".$v['month_no']."'),";
				///				
				 $valueStr2 .= "('".$v['stockno']."',
				 '".$v['departno']."',
				 '".$v['deliveryday']."',
				 ".$v['orderqty']*(-1)*$vbn.",
				 '".$v['lastupdate']."',
				 '".'進貨退出單'."',
				 '".$v['query_no']."',		 
				 '".'退'.$brr[1].$v['vendor_name']."',			
				 '".$v['month_no']."'),";
			 ////////
				 $valueStr3 .= "('".$v['departno']."',
				 '".$v['stockno']."',
				 ".$v['orderqty']*$vbn.",
				 ".$v['orderqty']*(-1)*$vbn.",
				 '".$v['lastupdate']."',
				 '".$v['month_no']."'),";
			 /////////
				 $valueStr4 .= "('".$v['departno']."',
				 '".$v['stockno']."',
				 ".$v['orderqty']*(-1)*$vbn.",
				 '".$v['month_no']."-".$v['deliveryday']."'),";
			 /////
				 $valueStr6 .= "('".$v['oring_no']."',
				 '".$v['stockno']."',		    
				 ".$v['orderqty'].",
				 ".$v['unit_price'].",
				 '".$v['vendor_partno']."',
				 '".$v['reshipdate']."',
				 ".$v['orderqty']*(-1).",
				 '".$v['lastupdate']."',
				 ".$v['cancelqty'].",
				 ".$v['orderqty']*(-1)."),"; 		
			}	      	 
			 //////
			 $valueStr5 .= "('".$v['month_no']."-".$v['deliveryday']."',
			 '".$v['query_no']."',
			 '".$v['vendor_no']."',
			 '".$v['oring_no']."',
			 '".$v['stockno']."',
			 ".$v['orderqty']*(-1).",
			 ".$v['unit_price'].",
			 '".$v['check_way']."',
			 '".$v['lastupdate']."',			
			 '".$v['crncy_no']."',
			 ".$v['crncy_rate'].",
			 '".$v['remark']."',		          
			 '".$tax_isinside."', 			 
			 '".$v['invoice_no']."',	
			 '".$v['rjtordscnt']."',
			 '".$v['salesno']."',		
			 '".($v['deliveryday']<=$v['settle_day']?$v['month_no']:mnthPlus($v['month_no']))."'),";        
		}  
	    if($brr[7]=='23' && $brr[8]=='1' &&  preg_match($regex, $v['invoice_no'])){
	         $valueStr5 .= "('".$v['month_no']."-".$v['deliveryday']."',
			 '".$v['query_no']."',
			 '".$v['vendor_no']."',
			 '".$v['oring_no']."',
			 '稅額',
			 (-1),
			 ".round($summoney*$taxrate/100,$rnddgt).",
			 '".$v['check_way']."',
			 '".$v['lastupdate']."',			
			 '".$_COOKIE["INT_011"]."',
			 1,
			 '".$v['remark']."',		          
			 '00', 			 
			 '".$v['invoice_no']."',	
			 '".$v['rjtordscnt']."',
			 '".$v['salesno']."',		
			 '".($v['deliveryday']<=$v['settle_day']?$v['month_no']:mnthPlus($v['month_no']))."'),";        
		 
	    }	     
		if($brr[11]!='3'){  //退貨
		    $valueStr1 = substr($valueStr1,0,strlen($valueStr1)-1);   //去掉最右邊的逗號,新增出貨月報表
			$valueStr2 = substr($valueStr2,0,strlen($valueStr2)-1);   //去掉最右邊的逗號,異動庫存異動表
			$valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
			$valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細	
			$valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動客戶訂單表身      
			$insertSql[0] = "INSERT INTO d11 (F01,F02,F03,F04,F05,F06,F07,F08,F09,F10,F15,F16,F17,F19,F90) VALUES ".$valueStr1;       
			$insertSql[1] = "INSERT INTO b26 (F01,F02,F03,F04,F05,F06,F07,F08,F90) VALUES ".$valueStr2; 
			$insertSql[2] = "INSERT INTO b25 (F01,F02,F05,F15,F16,F90) VALUES ".$valueStr3." ON DUPLICATE KEY UPDATE F05=F05+VALUES(F05),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
			$insertSql[3] = "INSERT INTO b11 (F01,F03,F04,F05) VALUES ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     	
			$insertSql[4] = "INSERT INTO d04 (F01,F02,F03,F04,F05,F06,F09,F12,F21,F24) VALUES ".$valueStr6." ON DUPLICATE KEY UPDATE F06=VALUES(F06),F09=F09+VALUES(F09),F12=VALUES(F12),F21=F21+VALUES(F21),F24=F24+VALUES(F24)";
		    $taxmoney=round($tax_isinside=='02'?($summoney-$summoney/(1+$taxrate/100)):(($v['tax_type']=='1' && $v['invoice_type']=='23')?$summoney*$taxrate/100:0),$rnddgt);	 
        	 $beforetax=($tax_isinside=='02'?($summoney-$taxmoney):$summoney);	 
	        $aftertax=$beforetax+$taxmoney;	     
            $shouldpayday=lastpayday($v['month_no'],$v['deliveryday'],$v['settle_day'],$v['check_way'],$v['paymentdays'],'');
            
			$insertSql[5] = "insert into k25 (F01,F02,F03,F04,F07,F08,F09,F10,F12,F14,F15,F19,F21,F22,F23,F24,F25,F26,F90) values ";
	        $insertSql[5].= "('".$v['invoice_type']."','".$brr[2]."','".$brr[1]."','".$v['united_no']."','".$brr[6]."',".$beforetax.",'".$v['tax_type']."',";
	        $insertSql[5].= $taxmoney.",".$aftertax.",'".$v['departno']."','".$v['query_no']."','".$brr[3]."','".$brr[9]."',".$brr[10].",";
            $insertSql[5].= $originmoney.",'".$v['lastupdate']."','".$lastdate."','".$v['check_way']."','".$v['month_no']."')";
		   foreach ($insertSql as  $values){
		       @mysqli_query($link,$values);
		    }
		}	 
		$valueStr5 = substr($valueStr5,0,strlen($valueStr5)-1);   //去掉最右邊的逗號,新增應收帳款對帳單
		$insertSql5 = "insert into d19 (F01,F02,F03,F04,F05,F06,F07,F09,F12,F13,F14,F15,F16,F17,F18,F19,F90) VALUES ".$valueStr5;      
		@mysqli_query($link,$insertSql5) ;  	 
		$mscnt="UPDATE d01 SET F14='".$brr[14]."-".$brr[2]."' " ;
		$mscnt.="WHERE F01='".$brr[1]."' AND (F14<'".$brr[14]."-".$brr[2]."' OR F14 IS NULL)" ;	                                                      
		mysqli_query($link ,$mscnt) or die(mysqli_error($link));    //寫入MySQL 		   
		$mscnt="UPDATE b03 SET F10='".$brr[13]."',";	    	  
		$mscnt.=" F22='".$v['invoice_type']."',";
	    $mscnt.=" F23='".$v['tax_type']."',";		
		$mscnt.=" F13='".$lastdate.$list4['F03']."'";
		$mscnt.=" WHERE F01="."'".$brr[0]."'";	                                                 	 
		mysqli_query($link ,$mscnt) or die(mysqli_error($link));  	  //寫入MySQL 
		$arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
		echo json_encode($arr); 
	}
}else{
	   echo json_encode("此進貨退出單已被確認過(.|.)"); 
   
} 
mysqli_close($link);	
 	
?>
 