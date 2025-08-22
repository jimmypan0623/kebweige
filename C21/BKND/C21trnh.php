<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");          //引用檔   
 $sql7="select `F15` from `c26` where `F01`='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_array($sql8);  //檢查是否已轉單
if($list2['F15']!='Y'){


     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d');
   ////先轉表頭c03
      $sql5="select F07,F32 from `c01` where `F01`='".trim($brr[1])."'"; 
      $sql6=@mysqli_query($link,$sql5);                       
      $list1=mysqli_fetch_array($sql6);  //先抓c01客戶主檔需用的欄位
       $sql2="insert into c03 (F01,F02,F03,F06,F07,F10,F12,F13,F14) values ('".$brr[10]."', 
	   '".$brr[2]."','".$brr[1]."','".$list1['F07']."','".$brr[3]."','".$lastdate.$list4['F03']."','".$brr[4]."', 
	   '".$list1['F32']."','".$brr[0]."')";         
	  @mysqli_query($link,$sql2) ;  
   ////轉表身c04

	  $sql3="select c27.*,DATE_ADD('".$lastdate."',INTERVAL b01.F28+b01.F31 DAY) as dlvdays  from c27,b01 where c27.F01='".$brr[0]."' and b01.F01=c27.F02 order by c27.F02"; 
	 
      $sql4=@mysqli_query($link,$sql3); 
   $arr=array(); 
	 while ($list3=mysqli_fetch_array($sql4)){
		 $my_array  = array('order_no'=>$brr[10], 		             
					  'stockno'=>$list3['F02'], 
					  'order_qty'=>$list3['F03'], 
					  'query_price'=>$list3['F04'],
					  'custom_partno'=>$list3['F05'],					
					  'delivery'=>$list3['dlvdays'],				  			 				
                      'lastupdate'=>$lastdate.$list4['F03']);   
			array_push($arr,$my_array);		  
	 }
	 $valueStr = '';
      foreach($arr as $v){
         $valueStr .= "('".$v['order_no']."','".$v['stockno']."',".$v['order_qty'].",
		 ".$v['query_price'].",'".$v['custom_partno']."','".$v['delivery']."',		 
		 '".$v['lastupdate']."'),";
     }  
	 
     $valueStr = substr($valueStr,0,strlen($valueStr)-1);   //去掉最右邊的逗號
 
     $insertSql = "insert into c04 (F01,F02,F03,F04,F05,F06,F12) values".$valueStr; 
 
      @mysqli_query($link,$insertSql) ;  
	  
      
	   $mscnt="UPDATE c26 SET F15='".$brr[9]."',";	    	  
	   $mscnt.=" F05='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	 	   
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);

}
mysqli_close($link);	

?>
 