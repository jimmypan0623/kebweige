<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔      
   $delmsg=$_POST['filename'];
   $sql7="SELECT `F10` FROM `b09` where `F01`='".$delmsg."'"; 
   $sql8=@mysqli_query($link,$sql7);                       
   $list2=mysqli_fetch_assoc($sql8);  //檢查是否已反確認過
if(trim($list2['F10'])=="Y"){   

			$lastdate=date('Y'.'-'.'m'.'-'.'d');
			
			$mscnt[]="DELETE FROM `b26` WHERE `F07`='".$delmsg."'";	                        		
			      		
			foreach ($mscnt as $delvalue){
				mysqli_query($link ,$delvalue) or die(mysqli_error($link)); 
			}
			 $sql3="SELECT b0i.F01,b0i.F03,b0i.F04,b09.F02,b09.F05,b09.F90 FROM b0i,b09 WHERE b0i.F01='".$delmsg."' AND b09.F01='".$delmsg."' ORDER BY b0i.F03"; 		 
			 $sql4=@mysqli_query($link,$sql3); 
			 $arr=array(); 
			 while ($list3=mysqli_fetch_assoc($sql4)){
				 $my_array  = array('query_no'=>$list3['F01'],		
				                'deliveryday'=>$list3['F02'],	
								'stockno'=>$list3['F03'],		
								'orderqty'=>$list3['F04'],
								'lastupdate'=>$lastdate.$_SESSION['user_name'],
								'departno'=>$list3['F05'],												  	
								'month_no'=>$list3['F90'] 
							 );   		     
					array_push($arr,$my_array);		          		
			}		
			
			 $valueStr5 ='';	
			 $valueStr6 ='';
			foreach($arr as $v){
				
					
					 
					    //b25庫存月報    //轉入
					 $valueStr5 .= "('".$v['departno']."',     
					 '".$v['stockno']."',
					 ".$v['orderqty']*(-1).",
					 ".$v['orderqty']*(-1).",
					 '".$v['lastupdate']."',
					 '".$v['month_no']."'),";
					 //b11庫存明細
					 $valueStr6 .= "('".$v['departno']."',  
					 '".$v['stockno']."',
					 ".$v['orderqty']*(-1).",
					 '".$v['month_no']."-".$v['deliveryday']."'),";
				
				     
			}       		 
			
            $valueStr5 = substr($valueStr5,0,strlen($valueStr5)-1);   //去掉最右邊的逗號,異動庫存月報表
			$valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動即時庫存明細			
			
			$insertSql[] = "insert into b25 (F01,F02,F13,F15,F16,F90) values ".$valueStr5." ON DUPLICATE KEY UPDATE F13=F13+VALUES(F13),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
			$insertSql[] = "insert into b11 (F01,F03,F04,F05) values ".$valueStr6." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     			 
			
			foreach ($insertSql as  $values){
				@mysqli_query($link,$values);
			}
			$mscnt="UPDATE `b09` SET `F10`='N',`F11`='".$lastdate.$_SESSION['user_name']."' WHERE `F01`='".$delmsg."'";								   
			mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
			$arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$_SESSION['user_name']);
			echo json_encode($arr);
		 	
	
}else{
	 echo json_encode("此移轉單已被反確認過(.|.)"); 
}	
	mysqli_close($link);
?>
