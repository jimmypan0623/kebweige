<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔      
   $delmsg=$_POST['filename'];
   $sql7="SELECT `F10` FROM `b02` where `F01`='".$delmsg."'"; 
   $sql8=@mysqli_query($link,$sql7);                       
   $list2=mysqli_fetch_assoc($sql8);  //檢查是否已反確認過
if(trim($list2['F10'])=="Y"){   
    $sqlA="SELECT d04.F09,b0b.F04 FROM d04,b0b WHERE d04.F01=b0b.F07 AND d04.F02=b0b.F03 AND b0b.F01='".$delmsg."' AND d04.F09-b0b.F04<0";
    $sqlB=@mysqli_query($link,$sqlA);
    $rowsA=@mysqli_num_rows($sqlB);    
	if($rowsA>0){   //訂單已出數量小於要反過帳的量
        $arr = array ('order_no'=>0,'lastupdate'=>'');
		echo json_encode($arr);  		
	}else{
		$sqlD="SELECT F27,F28 FROM k25 WHERE F15='".$delmsg."' AND F27+F28>0";
		$sqlE=@mysqli_query($link,$sqlD);
		$rowsB=@mysqli_num_rows($sqlE);    
		if($rowsB>0){
			 echo json_encode("此進貨單應付帳款已沖銷，無法反確認(反過帳)!"); 
		}else{				
			$lastdate=date('Y'.'-'.'m'.'-'.'d');
			$mscnt[]="DELETE FROM `d11` WHERE `F04`='".$delmsg."'";	     
			$mscnt[]="DELETE FROM `b26` WHERE `F07`='".$delmsg."'";	                        		
			$mscnt[]="DELETE FROM `d19` WHERE `F02`='".$delmsg."'";	         
			$mscnt[]="DELETE FROM `k25` WHERE `F15`='".$delmsg."'";	         		
			foreach ($mscnt as $delvalue){
				mysqli_query($link ,$delvalue) or die(mysqli_error($link)); 
			}
			 $sql3="SELECT b0b.*,b02.F02 AS F0B,b02.F90,b01.F98 FROM b0b,b02,b01 WHERE b0b.F01='".$delmsg."' AND b02.F01='".$delmsg."' AND b01.F01=b0b.F03 ORDER BY b0b.F03"; 		 
			 $sql4=@mysqli_query($link,$sql3); 
			 $arr=array(); 
			 while ($list3=mysqli_fetch_assoc($sql4)){
				 $my_array  = array('query_no'=>$list3['F01'],			              
								'stockno'=>$list3['F03'],
								'deliveryday'=>$list3['F0B'],
								'orderqty'=>$list3['F04'],				
								'oring_no'=>$list3['F07'],   //訂單編號				
								'unit_price'=>$list3['F15'],  //單價					    
								'lastupdate'=>$lastdate.$_SESSION['user_name'],
								'departno'=>$list3['F05'],					
								'vendor_partno'=>$list3['F08'],		
								'mrt_type'=>$list3['F98'],		
								'month_no'=>$list3['F90'] 
							 );   		     
					array_push($arr,$my_array);		          		
			}		
			 $valueStr3 ='';
			 $valueStr4 ='';	
			 $valueStr6 ='';
			foreach($arr as $v){
				if($v['mrt_type']=='NNN'){   //虛擬料號
					$vbn=0;
				}else{
					$vbn=1;
				}
					   //b25庫存月報
					 $valueStr3 .= "('".$v['departno']."',     
					 '".$v['stockno']."',
					 ".$v['orderqty']*(-1)*$vbn.",
					 ".$v['orderqty']*(-1)*$vbn.",
					 '".$v['lastupdate']."',
					 '".$v['month_no']."'),";
					 //b11庫存明細
					 $valueStr4 .= "('".$v['departno']."',  
					 '".$v['stockno']."',
					 ".$v['orderqty']*(-1)*$vbn.",
					 '".$v['month_no']."-".$v['deliveryday']."'),";
				
				 //d04訂單表身
				 $valueStr6 .= "('".$v['oring_no']."',
				 '".$v['stockno']."',		    
				 ".$v['orderqty'].",
				 ".$v['unit_price'].",
				 '".$v['vendor_partno']."',
				 '".$v['month_no']."-".$v['deliveryday']."',
				 ".$v['orderqty']*(-1).",
				 '".$v['lastupdate']."',
				 ".$v['orderqty']."),"; 			      
			}       
			 $valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
			 $valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細	 
			 $valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動客戶訂單表身  
			 $insertSql[] = "insert into b25 (F01,F02,F04,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
			 $insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     	
			 $insertSql[] = "insert into d04 (F01,F02,F03,F04,F05,F06,F09,F12,F23) values ".$valueStr6." ON DUPLICATE KEY UPDATE F09=F09+VALUES(F09),F12=VALUES(F12),F23=F23+VALUES(F23)";   
			 foreach ($insertSql as  $values){
				@mysqli_query($link,$values);
			}
			$mscnt="UPDATE `b02` SET `F10`='N',`F11`='".$lastdate.$_SESSION['user_name']."' WHERE `F01`='".$delmsg."'";								   
			mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
			$arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$_SESSION['user_name']);
			echo json_encode($arr);
		}			
	}
}else{
   echo json_encode("此進貨單已被反確認過(.|.)"); 
}	
	mysqli_close($link);
?>
