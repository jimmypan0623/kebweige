<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔      
   $delmsg=$_POST['filename'];
   $sql7="SELECT `F10` FROM `b06` where `F01`='".$delmsg."'"; 
   $sql8=@mysqli_query($link,$sql7);                       
   $list2=mysqli_fetch_assoc($sql8);  //檢查是否已反確認過
if(trim($list2['F10'])=="Y"){   
   
		
			$sql0="SELECT * FROM `a01` WHERE F01="."'".$_COOKIE['useraccount']."'"; 
			$sql1=@mysqli_query($link,$sql0);
			$rows1=@mysqli_num_rows($sql1);                       
			$list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
			$lastdate=date('Y'.'-'.'m'.'-'.'d');
			
			$mscnt[]="DELETE FROM `b26` WHERE `F07`='".$delmsg."'";	                        		
			      		
			foreach ($mscnt as $delvalue){
				mysqli_query($link ,$delvalue) or die(mysqli_error($link)); 
			}
			 $sql3="SELECT b0f.F01,b0f.F03,b0f.F04,b06.F02,b06.F05,b06.F07,b06.F90 FROM b0f,b06 WHERE b0f.F01='".$delmsg."' AND b06.F01='".$delmsg."' ORDER BY b0f.F03"; 		 
			 $sql4=@mysqli_query($link,$sql3); 
			 $arr=array(); 
			 while ($list3=mysqli_fetch_assoc($sql4)){
				 $my_array  = array('query_no'=>$list3['F01'],		
				                'deliveryday'=>$list3['F02'],	
								'stockno'=>$list3['F03'],		
								'orderqty'=>$list3['F04'],
								'lastupdate'=>$lastdate.$list4['F03'],
								'departno'=>$list3['F05'],					
							    'receivedpt'=>$list3['F07'],		
								'month_no'=>$list3['F90'] 
							 );   		     
					array_push($arr,$my_array);		          		
			}		
			 $valueStr3 ='';
			 $valueStr4 ='';	
			 $valueStr5 ='';	
			 $valueStr6 ='';
			foreach($arr as $v){
				
					   //b25庫存月報    //轉出
					 $valueStr3 .= "('".$v['departno']."',     
					 '".$v['stockno']."',
					 ".$v['orderqty']*(-1).",
					 ".$v['orderqty'].",
					 '".$v['lastupdate']."',
					 '".$v['month_no']."'),";
					 //b11庫存明細
					 $valueStr4 .= "('".$v['departno']."',  
					 '".$v['stockno']."',
					 ".$v['orderqty'].",
					 '".$v['month_no']."-".$v['deliveryday']."'),";
					 
					    //b25庫存月報    //轉入
					 $valueStr5 .= "('".$v['receivedpt']."',     
					 '".$v['stockno']."',
					 ".$v['orderqty']*(-1).",
					 ".$v['orderqty']*(-1).",
					 '".$v['lastupdate']."',
					 '".$v['month_no']."'),";
					 //b11庫存明細
					 $valueStr6 .= "('".$v['receivedpt']."',  
					 '".$v['stockno']."',
					 ".$v['orderqty']*(-1).",
					 '".$v['month_no']."-".$v['deliveryday']."'),";
				
				     
			}       		 
			$valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
			$valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細
            $valueStr5 = substr($valueStr5,0,strlen($valueStr5)-1);   //去掉最右邊的逗號,異動庫存月報表
			$valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動即時庫存明細			
			$insertSql[] = "insert into b25 (F01,F02,F09,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F09=F09+VALUES(F09),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
			$insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     			 
			
			$insertSql[] = "insert into b25 (F01,F02,F08,F15,F16,F90) values ".$valueStr5." ON DUPLICATE KEY UPDATE F08=F08+VALUES(F08),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
			$insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr6." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     			 
			
			foreach ($insertSql as  $values){
				@mysqli_query($link,$values);
			}
			$mscnt="UPDATE `b06` SET `F10`='N',`F11`='".$lastdate.$list4['F03']."' WHERE `F01`='".$delmsg."'";								   
			mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
			$arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$list4['F03']);
			echo json_encode($arr);
		 	
	
}else{
	 echo json_encode("此移轉單已被反確認過(.|.)"); 
}	
	mysqli_close($link);
?>
