<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
 foreach($cart as $key=>$val){	
    $brr[]=$val;
} 
	//以下處理MySQL記錄異動
    include("../../include/BKND/mysqli_server.php");         //引用檔
	$mscnt="UPDATE a01 SET F02='".$brr[2]."' WHERE F00='".$brr[3]."'";                              
    $sql=$mscnt;                                               //寫入MySQL 	member->users
    mysqli_query($link ,$sql) or die(mysqli_error($link)); 
	mysqli_close($link);
	
	echo  json_encode("密碼已變更！下次登入請記得使用新密碼。");
?>
