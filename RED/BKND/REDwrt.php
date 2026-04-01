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
	// 增加安全轉義
$newPsd = mysqli_real_escape_string($link, $brr[1]); // 前端 REDelements[1] 是新密碼
$userId = mysqli_real_escape_string($link, $brr[3]); // UserID
if (empty($newPsd) || empty($userId)) {
    echo json_encode("更新失敗：資料不完整。");
    exit;
}
$sql = "UPDATE a01 SET F02='$newPsd' WHERE F00='$userId'";
mysqli_query($link, $sql) or die(mysqli_error($link));

	
	mysqli_close($link);

	echo  json_encode("密碼已變更！下次登入請記得使用新密碼。");
?>  
 