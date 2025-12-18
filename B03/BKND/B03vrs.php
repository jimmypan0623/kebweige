<?php
  header("Content-Type:text/html; charset=utf-8");   
  include("../../include/BKND/mysqli_server.php");                              //引用檔    
   $delmsg=$_POST['filename'];
$sql7="SELECT `F10`,`F24` FROM `b03` where `F01`='".$delmsg."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已反確認過
if(trim($list2['F10'])=="Y"){      
    $sql0="SELECT * FROM `a01` WHERE F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d');   
	  $mscnt="DELETE FROM `d19` WHERE `F02`='".$delmsg."'";	   	    	  	  
      mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
	    $mscnt="DELETE FROM `k25` WHERE `F15`='".$delmsg."'";	   	    	  	  
      mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
	 $sql3="SELECT b0c.*,b03.F02 As F0B,b03.F24,b03.F90,b01.F98 FROM b0c,b03,b01 WHERE b0c.F01='".$delmsg."' AND b03.F01='".$delmsg."' AND b01.F01=b0c.F03 ORDER BY b0c.F03"; 	 
	 $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	  
	 while ($list3=mysqli_fetch_assoc($sql4)){
		 $my_array  = array('query_no'=>$list3['F01'],			              
					    'stockno'=>$list3['F03'],
					    'deliveryday'=>$list3['F0B'],
					    'orderqty'=>($list3['F24']=='3'?0:$list3['F04']),  //折讓或退貨
						'cancelqty'=>($list3['F24']=='2'?$list3['F04']:0),  //退回不補取消量
					    'oring_no'=>$list3['F07'],   //訂單編號				
					    'unit_price'=>$list3['F15'],  //單價					    
					    'lastupdate'=>$lastdate.$list4['F03'],
					    'departno'=>$list3['F05'],					
					    'vendor_partno'=>$list3['F08'],			
						'mrt_type'=>$list3['F98'],
					    'month_no'=>$list3['F90'] 
                     );   		     
			array_push($arr,$my_array);		          		
		
	}
	 $mscnt="DELETE FROM `d11` where `F04`='".$delmsg."'";	    
	 mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
	 $mscnt="DELETE FROM `b26` WHERE `F07`='".$delmsg."'";	                        
     mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
	 if($list2['F24']!=3){    //如果是退貨
	   
        
	    
	    $valueStr3 ='';
	    $valueStr4 ='';	
	    $valueStr6 ='';
        foreach($arr as $v){	
		    if($v['mrt_type']=='NNN'){  //虛擬料號	
			    $vbn=0;
			}else{
				$vbn=1;
			}
				   //b25庫存月報
				 $valueStr3 .= "('".$v['departno']."',     
				 '".$v['stockno']."',
				 ".$v['orderqty']*(-1)*$vbn.",
				 ".$v['orderqty']*$vbn.",
				 '".$v['lastupdate']."',
				 '".$v['month_no']."'),";
				 //b11庫存明細
				 $valueStr4 .= "('".$v['departno']."',  
				 '".$v['stockno']."',
				 ".$v['orderqty']*$vbn.",
				 '".$v['month_no']."-".$v['deliveryday']."'),";
			
			 //d04訂單表身
			 $valueStr6 .= "('".$v['oring_no']."',
			 '".$v['stockno']."',		    
			 ".$v['orderqty'].",
			 ".$v['unit_price'].",
			 '".$v['vendor_partno']."',
			 '".$v['month_no']."-".$v['deliveryday']."',
			 ".$v['orderqty'].",
			 ".$v['cancelqty']*(-1).",
			 '".$v['lastupdate']."',
			 ".$v['orderqty']."),"; 				
        }       		 
		$valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
		$valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細	 
		$valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動客戶訂單表身  		
		$insertSql[] = "INSERT INTO b25 (F01,F02,F05,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F05=F05+VALUES(F05),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
		$insertSql[] = "INSERT INTO b11 (F01,F03,F04,F05) values ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     	
        $insertSql[] = "INSERT INTO d04 (F01,F02,F03,F04,F05,F06,F09,F21,F12,F24) values ".$valueStr6." ON DUPLICATE KEY UPDATE F09=F09+VALUES(F09),F21=F21+VALUES(F21),F12=VALUES(F12),F24=F24+VALUES(F24)";   
        foreach ($insertSql as  $values){
		   @mysqli_query($link,$values);
		}
	}
    $mscnt="UPDATE `b03` SET `F10`='N',`F13`='".$lastdate.$list4['F03']."' WHERE `F01`='".$delmsg."'";                  
    mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
	$arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$list4['F03']);
	echo json_encode($arr);
}		
	mysqli_close($link);
?>
