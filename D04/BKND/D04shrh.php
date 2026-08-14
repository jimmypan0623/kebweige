<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$cart=json_decode($str_json);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
require_once("../../include/BKND/mysqli_server.php");      //引用檔   
 $sql7="select `F04` from `d03` where `F01`='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
if($list2['F04']!='Y'){
     
     $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  

	   $mscnt="UPDATE d03 SET F04='".$brr[8]."',";	    	  
	   $mscnt.=" F10='".$lastdate.$_SESSION['user_name']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$_SESSION['user_name']);
	    echo json_encode($arr);
}else{
	echo json_encode("此採購單已被確認過(.|.)"); 
}
mysqli_close($link);	
 	
?>
 