<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");      
   $delmsg=$_POST['filename'];
$sql7="SELECT `F10` FROM `b04` where `F01`='".$delmsg."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_array($sql8);  //檢查是否已反確認過
if(trim($list2['F10'])=="Y"){   
   
   $sql0="SELECT * FROM `a01` WHERE F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
    $lastdate=date('Y'.'-'.'m'.'-'.'d');


	  $mscnt="DELETE FROM `b26` WHERE `F07`='".$delmsg."'";
	                        
      mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 

	  $mscnt="DELETE FROM `c13` WHERE `F02`='".$delmsg."'";
	                        
      mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
	 
	 ////
	 $sql3="select b0d.*,b04.F02 As F0B,b04.F90 from b0d,b04 where b0d.F01='".$delmsg."' and b04.F01='".$delmsg."'  order by b0d.F03"; 
	 
	 	 $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	 while ($list3=mysqli_fetch_array($sql4)){
		 $my_array  = array('query_no'=>$list3['F01'],			              
					    'stockno'=>$list3['F03'],
					    'deliveryday'=>$list3['F0B'],
					    'orderqty'=>$list3['F04'],				
					    'oring_no'=>$list3['F07'],   //訂單編號				
					    'unit_price'=>$list3['F15'],  //單價					    
					    'lastupdate'=>$lastdate.$list4['F03'],
					    'departno'=>$list3['F05'],					
					    'custom_partno'=>$list3['F08'],					   					 
					    'month_no'=>$list3['F90'] 
                     );   		     
			array_push($arr,$my_array);		          		
	}
	
	 $valueStr3 ='';
	 $valueStr4 ='';	
	 $valueStr6 ='';
        foreach($arr as $v){
               //b25庫存月報
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
		     //c04訂單表身
	    	 $valueStr6 .= "('".$v['oring_no']."',
	    	 '".$v['stockno']."',		    
	    	 ".$v['orderqty'].",
			 ".$v['unit_price'].",
			 '".$v['custom_partno']."',
		     '".$v['month_no']."-".$v['deliveryday']."',
		     ".$v['orderqty']*(-1).",
		     '".$v['lastupdate']."',
	    	 ".$v['orderqty']."),"; 			      
        }       
	 $valueStr3 = substr($valueStr3,0,strlen($valueStr3)-1);   //去掉最右邊的逗號,異動庫存月報表
	 $valueStr4 = substr($valueStr4,0,strlen($valueStr4)-1);   //去掉最右邊的逗號,異動即時庫存明細	 
	 $valueStr6 = substr($valueStr6,0,strlen($valueStr6)-1);   //去掉最右邊的逗號,異動客戶訂單表身  
	 $insertSql3 = "insert into b25 (F01,F02,F06,F15,F16,F90) values ".$valueStr3." ON DUPLICATE KEY UPDATE F06=F06+VALUES(F06),F15=F15+VALUES(F15),F16=VALUES(F16)"; 
	 $insertSql4 = "insert into b11 (F01,F03,F04,F05) values ".$valueStr4." ON DUPLICATE KEY UPDATE F04=F04+VALUES(F04),F05=VALUES(F05)";     	
     $insertSql6 = "insert into c04 (F01,F02,F03,F04,F05,F06,F09,F12,F23) values ".$valueStr6." ON DUPLICATE KEY UPDATE F09=F09+VALUES(F09),F12=VALUES(F12),F23=F23+VALUES(F23)";   
	   @mysqli_query($link,$insertSql3) ;  
	   @mysqli_query($link,$insertSql4) ;  	  
	   @mysqli_query($link,$insertSql6) ;


	
     $mscnt="UPDATE `b04` SET `F10`='N',`F11`='".$lastdate.$list4['F03']."' WHERE `F01`='".$delmsg."'";
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link)); 
	 $arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
}		
	mysqli_close($link);

?>
