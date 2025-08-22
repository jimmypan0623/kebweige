<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");    //引用檔   
 $sql7="select `F08` from `c03` where `F01`='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list9=mysqli_fetch_array($sql8);  //檢查是否已轉單
if($list9['F08']!='Y'){    //已有出貨行為
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
      $lastdate=date('Y'.'-'.'m'.'-'.'d');
   ////先轉表頭b04
      $sql5="select F29,F30,F15,F36 from `c01` where `F01`='".trim($brr[1])."'"; 
      $sql6=@mysqli_query($link,$sql5);                       
      $list1=mysqli_fetch_array($sql6);  //先抓c01客戶主檔需用的欄位
	  $sql17="select F02 from `c00` where `F01`='".trim($brr[4])."'"; 
      $sql18=@mysqli_query($link,$sql17);                       
      $list2=mysqli_fetch_array($sql18);  //先抓c00匯率
       $sql2="insert into b04 (F01,F02,F06,F09,F11,F14,F16,F22,F23,F21,F12,F24,F90) values ('".$brr[9]."','".date('d')."', 
	   '".$brr[1]."','".$brr[3]."','".$lastdate.$list4['F03']."','".$brr[4]."','".$list2['F02']."','".$list1['F29']."', 
	   '".$list1['F30']."','".howpay($list1['F15']).($list1['F36']>0?$list1['F36']."天":"")."','".$brr[6]."','".$brr[7]."','".date('Y')."-".date('m')."')";         
	  @mysqli_query($link,$sql2) ;  	  	  
   ////轉表身b0d
	  $sql3="select c04.*,b01.F07 as F0G from c04 left outer join b01 on b01.F01=c04.F02 where c04.F01='".$brr[0]."' order by c04.F02"; 
      $sql4=@mysqli_query($link,$sql3); 
     $arr=array(); 
	 while ($list3=mysqli_fetch_array($sql4)){
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
     $insertSql = "insert into b0d (F01,F03,F04,F05,F07,F08,F09,F11,F15,F25) values ".$valueStr; 
      @mysqli_query($link,$insertSql) ;  
	
	  $c04update="UPDATE c04 SET F23=F03 WHERE F01='".$brr[0]."'";	
        mysqli_query($link , $c04update) or die(mysqli_error($link));		
	   $mscnt="UPDATE c03 SET F08='".$brr[8]."',";	    	  
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
 