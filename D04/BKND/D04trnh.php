<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");    //引用檔   
 $sql7="select `F08` from `d03` where `F01`='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list9=mysqli_fetch_assoc($sql8);  //檢查是否已轉單
if($list9['F08']!='Y'){    //已有出貨行為
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
      $lastdate=date('Y'.'-'.'m'.'-'.'d');
   ////先轉表頭b02
      $A='21';
	  $B='1';
      $sql5="select F13,F36 from `d01` where `F01`='".trim($brr[1])."'"; 
      $sql6=@mysqli_query($link,$sql5);                       
      $list1=mysqli_fetch_assoc($sql6);  //先抓d01客戶主檔需用的欄位
	  $sql17="select F02 from `d00` where `F01`='".trim($brr[4])."'"; 
      $sql18=@mysqli_query($link,$sql17);                       
      $list2=mysqli_fetch_assoc($sql18);  //先抓d00匯率
	  
       $sql2="insert into b02 (F01,F02,F06,F09,F11,F14,F16,F21,F12,F24,F90) values ('".$brr[9]."','".date('d')."', 
	   '".$brr[1]."','".$brr[3]."','".$lastdate.$list4['F03']."','".$brr[4]."','".$list2['F02']."',
	   '".howpay($list1['F13']).($list1['F36']>0?$list1['F36']."天":"")."','".$brr[0]."','".$brr[7]."','".date('Y')."-".date('m')."')";         
	  @mysqli_query($link,$sql2) ;  	  	  
   ////轉表身b0b
	  $sql3="select d04.*,b01.F07 as F0G from d04 left outer join b01 on b01.F01=d04.F02 where d04.F01='".$brr[0]."' order by d04.F02"; 
      $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	 while ($list3=mysqli_fetch_assoc($sql4)){
		 $my_array  = array('order_no'=>$brr[9], 		             
					  'stockno'=>$list3['F02'], 
					  'order_qty'=>$list3['F03'], 
					  'ship_dept'=>$list3['F0G'],
					  'origin_no'=>$brr[0],
					  'custom_partno'=>$list3['F05'],	
					  'custom_po'=>$brr[5],
					  'whoupdate'=>$lastdate.$list4['F03'],
					  'query_price'=>$list3['F04'],
					  'remark'=>$brr[0].'轉入');  					  									  
			array_push($arr,$my_array);		  
	 }
	 $valueStr = '';
      foreach($arr as $v){
         $valueStr .= "('".$v['order_no']."','".$v['stockno']."',".$v['order_qty'].",
		 '".$v['ship_dept']."','".$v['origin_no']."','".$v['custom_partno']."',
		 '".$v['custom_po']."','".$v['whoupdate']."',".$v['query_price'].",'".$v['remark']."'),";
     }  	 
     $valueStr = substr($valueStr,0,strlen($valueStr)-1);   //去掉最右邊的逗號
     $insertSql = "insert into b0b (F01,F03,F04,F05,F07,F08,F09,F11,F15,F25) values ".$valueStr; 
      @mysqli_query($link,$insertSql) ;  
	
	  $d04update="UPDATE d04 SET F23=F03 WHERE F01='".$brr[0]."'";	
        mysqli_query($link , $d04update) or die(mysqli_error($link));		
	   $mscnt="UPDATE d03 SET F08='".$brr[8]."',";	    	  
	   $mscnt.=" F10='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	 	   
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
}
mysqli_close($link);	
function howpay($flg){	 
	switch ($flg) {
        case '0':
            $payment='現結';
            break;
        case '1':
             $payment='月結';
            break;
        case '2':
	       $payment='次月結';
	       break;
	    case  '3':
	        $payment='T/T';
		    break;
        default:
	       $payment='現結';
	}
	return $payment;
} 	
?>
 