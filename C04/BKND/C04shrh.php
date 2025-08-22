<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");      //引用檔   
 $sql7="select `F04` from `c03` where `F01`='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_array($sql8);  //檢查是否已確認過
if($list2['F04']!='Y'){
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  

	   $mscnt="UPDATE c03 SET F04='".$brr[8]."',";	    	  
	   $mscnt.=" F10='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
}else{
	echo json_encode("此客戶訂單已被確認過"); 
}
mysqli_close($link);	
 	
?>
 